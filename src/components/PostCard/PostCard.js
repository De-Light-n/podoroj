import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import defaultPost from "../../assets/images/default-post.jpg";
import anonymousAvatar from "../../assets/icons/anonymous.png";
import { auth, db } from "../../components/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import "./PostCard.css";

function PostCard({ article, isMain }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(article.likes || 0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Відстежуємо стан автентифікації
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        setIsLiked(article.likedBy?.includes(user.uid) || false);
      }
    });
    return () => unsubscribe();
  }, [article.likedBy]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      return;
    }

    try {
      // Використовуємо API замість прямої роботи з Firestore
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          articleId: article.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to update favorites");

      const result = await response.json();
      setIsLiked(result.action === "added");
      setLikes(result.action === "added" ? likes + 1 : likes - 1);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Форматування дати
  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    let date;

    // Обробка різних форматів дати
    if (typeof timestamp === "object" && timestamp.toDate) {
      // Firebase Timestamp
      date = timestamp.toDate();
    } else if (timestamp?.seconds) {
      // Об'єкт з серіалізованим Timestamp {seconds: number, nanoseconds: number}
      date = new Date(timestamp.seconds * 1000);
    } else if (typeof timestamp === "string") {
      // Рядок дати
      date = new Date(timestamp);
    } else if (typeof timestamp === "number") {
      // Числовий timestamp
      date = new Date(timestamp);
    } else {
      return "";
    }

    // Перевірка чи дата валідна
    if (isNaN(date.getTime())) return "";

    return date
      .toLocaleString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(",", "");
  };

  if (isMain) {
    return (
      <Link
        to={`/post/${article.id}`}
        className={`card ${isLiked ? "liked" : ""}`}
      >
        <div className="card-image-container">
          <img
            src={article.imageUrl || defaultPost}
            alt={article.title}
            className="card-image"
            onError={(e) => {
              e.target.src = defaultPost;
            }}
          />
        </div>
        <div className="card-content">
          <div className="author-container">
            <img
              src={article.authorAvatar || anonymousAvatar}
              alt={article.authorName}
              className="author-avatar"
              onError={(e) => {
                e.target.src = anonymousAvatar;
              }}
            />
            <span className="posts-author">
              {article.authorName || "Анонім"}
            </span>
          </div>
          <h3 className="card-title">{article.title}</h3>
          <div className="card-date">{formatDate(article.createdAt)}</div>
          {currentUser && (
            <button
              className={`like-btn ${isLiked ? "active" : ""}`}
              onClick={handleLike}
              aria-label="Like this post"
            >
              <svg
                className="like-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  fill={isLiked ? "#ff4757" : "currentColor"}
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
              <span className="like-count">{likes}</span>
            </button>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/post/${article.id}`} className="sidebar-post-link">
      <div className="sidebar-post">
        <h3>{article.authorName || "Анонім"}</h3>
        <p>{article.title}</p>
        <div className="divider"></div>
      </div>
    </Link>
  );
}

export default PostCard;
