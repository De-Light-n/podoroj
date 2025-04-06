import React from "react";
import { useNavigate } from "react-router-dom";
import defaultPost from '../../assets/images/default-post.jpg';
import "../../styles/styles.css";
import "./Gallery.css";

function Gallery() {
  const navigate = useNavigate();

  const redirectToCreate = () => {
    navigate("/create-post");
  };

  // Дані публікацій
  const publications = [
    {
      id: 1,
      image: "istockphoto-665139550-612x612.jpg",
      title: "Жарка пустеля",
      date: "Опубліковано: 15.06.2023",
    },
    {
      id: 2,
      image: "mountains_6.jpg",
      title: "Дивовижні пейзажі Карпат",
      date: "Опубліковано: 10.06.2023",
    },
    {
      id: 3,
      image: "istockphoto-1044284546-612x612.jpg",
      title: 'Небезпечна "Амазонка"',
      date: "Опубліковано: 05.06.2023",
    },
  ];

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
    // Логіка редагування
    console.log(`Редагувати публікацію ${id}`);
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = (id) => {
    // Логіка видалення
    console.log(`Видалити публікацію ${id}`);
    // Тут можна додати підтвердження видалення
  };

  return (
    <div className="gallery-page">
      <div className="publications-header">
        <h1>Фото галерея</h1>
        <p>
          Тут ви можете керувати своїми статтями, створювати їх або видаляти
        </p>
      </div>

      {/* Секція "Створити пост" */}
      <div className="create-post-section">
        <div className="create-post-card">
          <div className="create-post-content">
            <div className="create-post-icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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

      {/* Список публікацій */}
      <div className="publications-list">
        <div className="my-cards">
          {publications.map((publication) => (
            <div key={publication.id} className="gal-card">
              <div className="gal-card-image-container">
                <img
                  src={getImageSource(publication.image)}
                  alt={publication.title}
                  className="gal-card-image"
                  onError={(e) => {
                    e.target.src = defaultPost;
                  }}
                />
              </div>
              <div className="gal-card-content">
                <h3 className="card-title">{publication.title}</h3>
                <div className="card-date">{publication.date}</div>
                <div className="publication-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(publication.id)}
                  >
                    Редагувати
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(publication.id)}
                  >
                    Видалити
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
