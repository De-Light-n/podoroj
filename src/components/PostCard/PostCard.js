// PostCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import defaultPost from '../../assets/images/default-post.jpg';
import anonymousAvatar from '../../assets/icons/anonymous.png';
import './PostCard.css';

function PostCard({ article, isMain }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        // Завантаження стану лайків з localStorage
        const savedLike = localStorage.getItem(`post-${article.id}-liked`);
        const savedLikes = localStorage.getItem(`post-${article.id}-likes`);

        setIsLiked(savedLike === 'true');
        setLikes(savedLikes ? parseInt(savedLikes) : 0);
    }, [article.id]);

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const newLikedState = !isLiked;
        const newLikes = newLikedState ? likes + 1 : likes - 1;

        setIsLiked(newLikedState);
        setLikes(newLikes);

        localStorage.setItem(`post-${article.id}-liked`, String(newLikedState));
        localStorage.setItem(`post-${article.id}-likes`, newLikes.toString());
    };

    // Функції для завантаження зображень залишаємо як були
    const getImageSource = (imgPath) => {
        try {
            if (!imgPath) return defaultPost;
            if (imgPath.startsWith('http')) return imgPath;
            const imageModule = require(`../../assets/images/${imgPath}`);
            return imageModule.default || imageModule;
        } catch (error) {
            return defaultPost;
        }
    };

    const getAvatarSource = (avatarPath) => {
        try {
            if (!avatarPath) return anonymousAvatar;
            if (avatarPath.startsWith('http')) return avatarPath;
            const avatarModule = require(`../../assets/images/${avatarPath}`);
            return avatarModule.default || avatarModule;
        } catch (error) {
            return anonymousAvatar;
        }
    };

    if (isMain) {
        return (
            <Link to={`/post/${article.id}`} className={`card ${isLiked ? 'liked' : ''}`}>
                <div className="card-image-container">
                    <img
                        src={getImageSource(article.img)}
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
                            src={getAvatarSource(article.authorImg)}
                            alt={article.author}
                            className="author-avatar"
                            onError={(e) => {
                                e.target.src = anonymousAvatar;
                            }}
                        />
                        <span className="posts-author">{article.author}</span>
                    </div>
                    <h3 className="card-title">{article.title}</h3>
                    <div className="card-date">{article.time}</div>
                    {/*<button*/}
                    {/*    className={`like-btn ${isLiked ? 'active' : ''}`}*/}
                    {/*    onClick={handleLike}*/}
                    {/*    aria-label="Like this post"*/}
                    {/*>*/}
                    {/*    <svg className="like-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">*/}
                    {/*        <path fill={isLiked ? '#ff4757' : 'currentColor'} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>*/}
                    {/*    </svg>*/}
                    {/*    <span className="like-count">{likes}</span>*/}
                    {/*</button>*/}
                </div>
            </Link>
        );
    }

    return (
        <Link to={`/post/${article.id}`} className="sidebar-post-link">
            <div className="sidebar-post">
                <h3>{article.author}</h3>
                <p>{article.title}</p>
                <div className="divider"></div>
            </div>
        </Link>
    );
}

export default PostCard;