import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
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
