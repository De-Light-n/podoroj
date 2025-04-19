const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");

// Ініціалізація Firebase
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

console.log(
  "Initializing Firebase with project ID:",
  serviceAccount.project_id
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://podoroj-5207b.firebaseio.com",
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

// Middleware для логування всіх вхідних запитів
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Отримання вподобаних статей
app.get("/api/favorites/:userId", async (req, res) => {
  try {
    console.log("\nGET /api/favorites called with userId:", req.params.userId);

    const userId = req.params.userId;
    const favoritesRef = db.collection("favorites").doc(userId);

    console.log("Fetching favorites for user:", userId);
    const doc = await favoritesRef.get();

    if (!doc.exists) {
      console.log("No favorites found for user:", userId);
      return res.json([]);
    }

    const favorites = doc.data().articles || [];
    console.log("Found favorites:", favorites);

    const articlesPromises = favorites.map((id) => {
      console.log("Fetching post with ID:", id);
      return db.collection("posts").doc(id).get();
    });

    const articlesSnapshots = await Promise.all(articlesPromises);
    console.log("Fetched", articlesSnapshots.length, "posts");

    const articlesData = articlesSnapshots
      .filter((snap) => snap.exists)
      .map((snap) => ({
        id: snap.id,
        ...snap.data(),
        likedBy: [userId],
      }));

    console.log("Returning articles data");
    res.json(articlesData);
  } catch (error) {
    console.error("Error in GET /api/favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Додавання/видалення вподобаних
app.post("/api/favorites", async (req, res) => {
  try {
    console.log("\nPOST /api/favorites called with body:", req.body);

    const { userId, articleId } = req.body;

    if (!userId || !articleId) {
      console.error(
        "Missing required fields - userId:",
        userId,
        "articleId:",
        articleId
      );
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(
      "Processing favorite for user:",
      userId,
      "and article:",
      articleId
    );

    const favoritesRef = db.collection("favorites").doc(userId);
    const postRef = db.collection("posts").doc(articleId);

    // Отримуємо поточний стан
    console.log("Fetching current state...");
    const [favoritesSnap, postSnap] = await Promise.all([
      favoritesRef.get(),
      postRef.get(),
    ]);

    let articles = favoritesSnap.exists
      ? favoritesSnap.data().articles || []
      : [];
    const isFavorite = articles.includes(articleId);
    console.log(
      "Current state - isFavorite:",
      isFavorite,
      "articles:",
      articles
    );

    if (isFavorite) {
      // Видалення з обраного
      articles = articles.filter((id) => id !== articleId);
      console.log("Removing favorite. New articles array:", articles);

      await favoritesRef.set({ articles });
      console.log("Updated favorites collection");

      await postRef.update({
        likes: admin.firestore.FieldValue.increment(-1),
        likedBy: admin.firestore.FieldValue.arrayRemove(userId),
      });
      console.log("Updated post likes (decrement)");

      return res.json({ action: "removed" });
    } else {
      // Додавання до обраного
      articles.push(articleId);
      console.log("Adding favorite. New articles array:", articles);

      await favoritesRef.set({ articles }, { merge: true });
      console.log("Updated favorites collection");

      await postRef.update({
        likes: admin.firestore.FieldValue.increment(1),
        likedBy: admin.firestore.FieldValue.arrayUnion(userId),
      });
      console.log("Updated post likes (increment)");

      return res.json({ action: "added" });
    }
  } catch (error) {
    console.error("Error in POST /api/favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("*", (req, res) => {
  console.log("Serving index.html for path:", req.path);
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}`);
  console.log(`Environment variables:`);
  console.log(`- FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID}`);
  console.log(`- FIREBASE_CLIENT_EMAIL: ${process.env.FIREBASE_CLIENT_EMAIL}`);
});
