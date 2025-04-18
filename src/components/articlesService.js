import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (file) => {
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const addArticle = async (articleData, imageFile, authorImageFile) => {
  try {
    // Завантажуємо зображення
    const imageUrl = await uploadImage(imageFile);
    const authorImageUrl = await uploadImage(authorImageFile);

    // Додаємо статтю до Firestore
    const docRef = await addDoc(collection(db, "articles"), {
      ...articleData,
      img: imageUrl,
      authorImg: authorImageUrl,
      createdAt: new Date(),
    });

    return docRef.id; // Повертаємо ID створеної статті
  } catch (error) {
    console.error("Error adding article: ", error);
    throw error;
  }
};

export const getArticles = async () => {
  const querySnapshot = await getDocs(collection(db, "articles"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addComment = async (articleId, comment) => {
  const articleRef = doc(db, "articles", articleId);
  await updateDoc(articleRef, {
    comments: [...(articleRef.comments || []), comment],
  });
};


// Додавання/видалення статті з вподобаних
export const toggleFavorite = async (articleId, userId) => {
  try {
    const favoritesRef = doc(db, 'favorites', userId);
    const docSnap = await getDoc(favoritesRef);
    
    if (docSnap.exists()) {
      const favorites = docSnap.data().articles || [];
      const isFavorite = favorites.includes(articleId);
      
      if (isFavorite) {
        await updateDoc(favoritesRef, {
          articles: arrayRemove(articleId)
        });
        await updateDoc(doc(db, 'articles', articleId), {
          likes: arrayRemove(userId)
        });
      } else {
        await updateDoc(favoritesRef, {
          articles: arrayUnion(articleId)
        });
        await updateDoc(doc(db, 'articles', articleId), {
          likes: arrayUnion(userId)
        });
      }
    } else {
      await setDoc(favoritesRef, {
        articles: [articleId]
      });
      await updateDoc(doc(db, 'articles', articleId), {
        likes: arrayUnion(userId)
      });
    }
    
    return !docSnap.exists() || !docSnap.data().articles.includes(articleId);
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

// Отримання вподобаних статей для користувача
export const getFavorites = async (userId) => {
  try {
    const favoritesRef = doc(db, 'favorites', userId);
    const docSnap = await getDoc(favoritesRef);
    
    if (docSnap.exists()) {
      return docSnap.data().articles || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    throw error;
  }
};