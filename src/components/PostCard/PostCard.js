import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import defaultPost from '../../assets/images/default-post.jpg';
import anonymousAvatar from '../../assets/icons/anonymous.png';
import { auth, db } from '../../components/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import './PostCard.css';

function PostCard({ article, isMain }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(article.likes || 0);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Відстежуємо стан автентифікації
        const unsubscribe = auth.onAuthStateChanged(user => {
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
            // Перенаправлення на сторінку входу, якщо користувач не авторизований
            return;
        }

        const postRef = doc(db, 'posts', article.id);
        const newLikedState = !isLiked;
        
        try {
            if (newLikedState) {
                // Додаємо лайк
                await updateDoc(postRef, {
                    likes: likes + 1,
                    likedBy: arrayUnion(currentUser.uid)
                });
                setLikes(likes + 1);
            } else {
                // Видаляємо лайк
                await updateDoc(postRef, {
                    likes: likes - 1,
                    likedBy: arrayRemove(currentUser.uid)
                });
                setLikes(likes - 1);
            }
            setIsLiked(newLikedState);
        } catch (error) {
            console.error("Помилка при оновленні лайка:", error);
        }
    };

    // Форматування дати
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return date.toLocaleString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(',', '');
    };

    if (isMain) {
        return (
            <Link to={`/post/${article.id}`} className={`card ${isLiked ? 'liked' : ''}`}>
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
                        <span className="posts-author">{article.authorName || 'Анонім'}</span>
                    </div>
                    <h3 className="card-title">{article.title}</h3>
                    <div className="card-date">{formatDate(article.createdAt)}</div>
                    <button
                        className={`like-btn ${isLiked ? 'active' : ''}`}
                        onClick={handleLike}
                        aria-label="Like this post"
                    >
                        <svg className="like-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path fill={isLiked ? '#ff4757' : 'currentColor'} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="like-count">{likes}</span>
                    </button>
                </div>
            </Link>
        );
    }

    return (
        <Link to={`/post/${article.id}`} className="sidebar-post-link">
            <div className="sidebar-post">
                <h3>{article.authorName || 'Анонім'}</h3>
                <p>{article.title}</p>
                <div className="divider"></div>
            </div>
        </Link>
    );
}

export default PostCard;