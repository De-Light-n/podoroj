import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../../components/PostCard/PostCard";
import { db, storage, auth } from "../../components/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import "./Articles.css";
import "../../styles/Posts.css";

function Articles() {
  const [sortBy, setSortBy] = useState("date-desc");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritesMode, setFavoritesMode] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (userId && user && user.uid !== userId) {
        navigate("/articles");
      }
    });
    return () => unsubscribe();
  }, [userId, navigate]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        let articlesData = [];

        if (userId) {
          const response = await fetch(`https://podoroj-backend.onrender.com/api/favorites/${userId}`);
          if (!response.ok) throw new Error("Failed to fetch favorites");
          articlesData = await response.json();
          setFavoritesMode(true);
        } else {
          const postsRef = collection(db, "posts");
          let q;

          switch (sortBy) {
            case "date-asc":
              q = query(postsRef, orderBy("createdAt", "asc"));
              break;
            case "date-desc":
              q = query(postsRef, orderBy("createdAt", "desc"));
              break;
            case "likes-asc":
              q = query(postsRef, orderBy("likes", "asc"));
              break;
            case "likes-desc":
              q = query(postsRef, orderBy("likes", "desc"));
              break;
            case "title-asc":
              q = query(postsRef, orderBy("title", "asc"));
              break;
            case "title-desc":
              q = query(postsRef, orderBy("title", "desc"));
              break;
            case "comments-asc":
              q = query(postsRef, orderBy("comments", "asc"));
              break;
            case "comments-desc":
              q = query(postsRef, orderBy("comments", "desc"));
              break;
            default:
              q = query(postsRef, orderBy("createdAt", "desc"));
          }

          const querySnapshot = await getDocs(q);

          for (const doc of querySnapshot.docs) {
            const postData = doc.data();
            let imageUrl = postData.imageUrl;

            if (!imageUrl && postData.imagePath) {
              const imageRef = ref(storage, postData.imagePath);
              imageUrl = await getDownloadURL(imageRef);
            }

            articlesData.push({
              id: doc.id,
              ...postData,
              imageUrl,
              time: postData.createdAt
                ?.toDate()
                .toLocaleString("uk-UA", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .replace(",", ""),
              likes: postData.likes || 0,
              comments: postData.comments || [],
            });
          }
          setFavoritesMode(false);
        }

        setArticles(articlesData);
        setLoading(false);
      } catch (err) {
        console.error("Помилка завантаження постів:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArticles();
  }, [sortBy, userId]);

  const handleToggleFavorite = async (articleId) => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://podoroj-backend.onrender.com/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: auth.currentUser.uid,
          articleId,
        }),
      });

      if (!response.ok) throw new Error("Failed to update favorites");

      // Оновлюємо локальний стан
      const result = await response.json();
      setArticles((prev) =>
        prev.map((article) => {
          if (article.id === articleId) {
            return {
              ...article,
              likes:
                result.action === "added"
                  ? article.likes + 1
                  : article.likes - 1,
              likedBy:
                result.action === "added"
                  ? [...(article.likedBy || []), auth.currentUser.uid]
                  : article.likedBy?.filter(
                      (id) => id !== auth.currentUser.uid
                    ) || [],
            };
          }
          return article;
        })
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <div className="error">Помилка: {error}</div>;
  }

  const mainArticles = favoritesMode
    ? articles
    : articles.slice(0, Math.ceil(articles.length / 2));
  const sidebarArticles = favoritesMode
    ? []
    : articles.slice(Math.ceil(articles.length / 2));

  return (
    <div className={`articles-page ${favoritesMode ? "favorites-view" : ""}`}>
      <div className="header-quotes">
        <h3>Дивись на світ іншими очима</h3>
        <h1>
          {favoritesMode ? "Мої вподобані статті" : "Дивовижні історії та фото"}
        </h1>

        {!favoritesMode && auth.currentUser && (
          <button
            className="cta-button"
            onClick={() => navigate(`/favorites/${auth.currentUser.uid}`)}
          >
            Переглянути мої вподобані
          </button>
        )}
      </div>

      {!favoritesMode && (
        <div className="sort-controls">
          <div className="sort-container">
            <svg
              className="sort-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 7H21"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M6 12H18"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M9 17H15"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <optgroup label="Дата">
                <option value="date-desc">Новіші спочатку</option>
                <option value="date-asc">Старіші спочатку</option>
              </optgroup>
              <optgroup label="Лайки">
                <option value="likes-desc">Найпопулярніші</option>
                <option value="likes-asc">Найменш популярні</option>
              </optgroup>
              <optgroup label="Назва">
                <option value="title-asc">А-Я</option>
                <option value="title-desc">Я-А</option>
              </optgroup>
              <optgroup label="Коментарі">
                <option value="comments-desc">Більше коментарів</option>
                <option value="comments-asc">Менше коментарів</option>
              </optgroup>
            </select>
            <div className="select-arrow">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="posts">
        <div className="cards">
          {mainArticles.map((article) => (
            <PostCard
              key={article.id}
              article={article}
              isMain={true}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={article.likedBy?.includes(auth.currentUser?.uid)}
            />
          ))}
        </div>

        {!favoritesMode && sidebarArticles.length > 0 && (
          <div className="sidebar">
            <h2>Інші пости</h2>
            {sidebarArticles.map((article) => (
              <PostCard
                key={article.id}
                article={article}
                isMain={false}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={article.likedBy?.includes(auth.currentUser?.uid)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Articles;
