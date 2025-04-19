const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://podoroj-5207b.firebaseio.com",
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

// Отримання вподобаних статей
app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const favoritesRef = db.collection("favorites").doc(userId);
    const doc = await favoritesRef.get();

    if (!doc.exists) {
      return res.json([]);
    }

    // Отримуємо повну інформацію про статті
    const favorites = doc.data().articles || [];
    const articlesPromises = favorites.map((id) =>
      db.collection("posts").doc(id).get()
    );

    const articlesSnapshots = await Promise.all(articlesPromises);
    const articlesData = articlesSnapshots
      .filter((snap) => snap.exists)
      .map((snap) => ({
        id: snap.id,
        ...snap.data(),
        likedBy: [userId], // Додаємо інформацію про лайк
      }));

    res.json(articlesData);
  } catch (error) {
    console.error("Error getting favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Додавання/видалення вподобаних
app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, articleId } = req.body;

    if (!userId || !articleId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const favoritesRef = db.collection("favorites").doc(userId);
    const postRef = db.collection("posts").doc(articleId);

    // Отримуємо поточний стан
    const [favoritesSnap, postSnap] = await Promise.all([
      favoritesRef.get(),
      postRef.get(),
    ]);

    let articles = favoritesSnap.exists
      ? favoritesSnap.data().articles || []
      : [];
    const isFavorite = articles.includes(articleId);

    // Оновлюємо favorites
    if (isFavorite) {
      articles = articles.filter((id) => id !== articleId);
      await favoritesRef.set({ articles });

      // Оновлюємо лайки в пості
      await postRef.update({
        likes: admin.firestore.FieldValue.increment(-1),
        likedBy: admin.firestore.FieldValue.arrayRemove(userId),
      });

      return res.json({ action: "removed" });
    } else {
      articles.push(articleId);
      await favoritesRef.set({ articles }, { merge: true });

      // Оновлюємо лайки в пості
      await postRef.update({
        likes: admin.firestore.FieldValue.increment(1),
        likedBy: admin.firestore.FieldValue.arrayUnion(userId),
      });

      return res.json({ action: "added" });
    }
  } catch (error) {
    console.error("Error updating favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
