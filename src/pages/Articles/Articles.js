import React, { useState, useEffect } from 'react';
import PostCard from '../../components/PostCard/PostCard';
import { db, storage } from '../../components/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import "./Articles.css";
import "../../styles/Posts.css";

function Articles() {
    const [sortBy, setSortBy] = useState('date-desc');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                // Отримуємо пости з Firestore
                const postsRef = collection(db, 'posts');
                let q;
                
                // Визначаємо порядок сортування в залежності від вибраного варіанту
                switch(sortBy) {
                    case 'date-asc':
                        q = query(postsRef, orderBy('createdAt', 'asc'));
                        break;
                    case 'date-desc':
                        q = query(postsRef, orderBy('createdAt', 'desc'));
                        break;
                    case 'likes-asc':
                        q = query(postsRef, orderBy('likes', 'asc'));
                        break;
                    case 'likes-desc':
                        q = query(postsRef, orderBy('likes', 'desc'));
                        break;
                    case 'title-asc':
                        q = query(postsRef, orderBy('title', 'asc'));
                        break;
                    case 'title-desc':
                        q = query(postsRef, orderBy('title', 'desc'));
                        break;
                    case 'comments-asc':
                        q = query(postsRef, orderBy('comments', 'asc'));
                        break;
                    case 'comments-desc':
                        q = query(postsRef, orderBy('comments', 'desc'));
                        break;
                    default:
                        q = query(postsRef, orderBy('createdAt', 'desc'));
                }

                const querySnapshot = await getDocs(q);
                const articlesData = [];

                // Для кожного поста отримуємо URL зображення з Storage
                for (const doc of querySnapshot.docs) {
                    const postData = doc.data();
                    let imageUrl = postData.imageUrl;
                    
                    // Якщо URL зображення не зберігається у Firestore, отримуємо його з Storage
                    if (!imageUrl && postData.imagePath) {
                        const imageRef = ref(storage, postData.imagePath);
                        imageUrl = await getDownloadURL(imageRef);
                    }

                    articlesData.push({
                        id: doc.id,
                        ...postData,
                        imageUrl,
                        time: postData.createdAt?.toDate().toLocaleString('uk-UA', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        }).replace(',', ''),
                        likes: postData.likes || 0,
                        comments: postData.comments || []
                    });
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
    }, [sortBy]);

    const halfLength = Math.ceil(articles.length / 2);
    const mainArticlesToRender = articles.slice(0, halfLength);
    const sidebarArticlesToRender = articles.slice(halfLength);

    if (loading) {
        return <div className="loading">Завантаження...</div>;
    }

    if (error) {
        return <div className="error">Помилка: {error}</div>;
    }

    return (
        <div className="articles-page">
            <div className="header-quotes">
                <h3>Дивись на світ іншими очима</h3>
                <h1>Дивовижні історії та фото</h1>
            </div>

            <div className="sort-controls">
                <div className="sort-container">
                    <svg className="sort-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 7H21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M6 12H18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M9 17H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
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
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="posts">
                <div className="cards">
                    {mainArticlesToRender.map(article => (
                        <PostCard key={article.id} article={article} isMain={true} />
                    ))}
                </div>

                <div className="sidebar">
                    <h2>Інші пости</h2>
                    {sidebarArticlesToRender.map(article => (
                        <PostCard key={article.id} article={article} isMain={false} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Articles;