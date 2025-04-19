import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import defaultPost from '../../assets/images/default-post.jpg';
import "../../styles/styles.css";
import "./Gallery.css";
import LoadingPage from "../../components/LoadingPage/LoadingPage";

function Gallery() {
  const navigate = useNavigate();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  const redirectToCreate = () => {
    navigate("/create-post");
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, "posts"), where("authorId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const posts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPublications(posts);
      } catch (error) {
        console.error("Помилка при завантаженні постів:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [auth]);

  const getImageSource = (imgPath) => {
    try {
      if (!imgPath) return defaultPost;
      if (imgPath.startsWith("http")) return imgPath;
      const imageModule = require(`../../assets/images/${imgPath}`);
      return imageModule.default || imageModule;
    } catch (error) {
      return defaultPost;
    }
  };

  const handleEdit = (id) => {
    navigate(`/podoroj/edit-post/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Видалити публікацію ${id}`);
    // Тут можна додати логіку видалення з Firestore
  };

  return (
    <div className="gallery-page">
      <div className="publications-header">
        <h1>Фото галерея</h1>
        <p>Тут ви можете керувати своїми статтями, створювати їх або видаляти</p>
      </div>

      <div className="create-post-section">
        <div className="create-post-card">
          <div className="create-post-content">
            <div className="create-post-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <h3>Додати нову публікацію</h3>
            <p>Натисніть, щоб почати створення нового посту</p>
            <button className="create-post-btn" onClick={redirectToCreate}>
              Створити пост
            </button>
          </div>
        </div>
      </div>

      <div className="publications-list">
        {loading ? (
          <LoadingPage/>
        ) : (
          <div className="my-cards">
            {publications.map((publication) => (
              <div key={publication.id} className="gal-card">
                <div className="gal-card-image-container">
                  <img
                    src={getImageSource(publication.imageUrl)}
                    alt={publication.title}
                    className="gal-card-image"
                    onError={(e) => {
                      e.target.src = defaultPost;
                    }}
                  />
                </div>
                <div className="gal-card-content">
                  <h3 className="card-title">{publication.title}</h3>
                  <div className="card-date">
                    {publication.createdAt?.toDate
                      ? `Опубліковано: ${publication.createdAt.toDate().toLocaleDateString()}`
                      : "Без дати"}
                  </div>
                  <div className="publication-actions">
                    <button className="edit-btn" onClick={() => handleEdit(publication.id)}>Редагувати</button>
                    <button className="delete-btn" onClick={() => handleDelete(publication.id)}>Видалити</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;
