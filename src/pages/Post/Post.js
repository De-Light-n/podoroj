import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mainArticles } from '../../data/articles_data';
import defaultPost from '../../assets/images/default-post.jpg';
import anonymousAvatar from '../../assets/icons/anonymous.png';
import "../../styles/styles.css";
import './Post.css';

function Post() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    // Function to handle image loading
    const getImageSource = (imgPath) => {
        try {
            if (!imgPath) return defaultPost;
            // Check if it's a URL (starts with http)
            if (imgPath.startsWith('http')) {
                return imgPath;
            }
            // For local images from assets
            const imageModule = require(`../../assets/images/${imgPath}`);
            return imageModule.default || imageModule;
        } catch (error) {
            return defaultPost;
        }
    };

    // Function to handle avatar loading
    const getAvatarSource = (avatarPath) => {
        try {
            if (!avatarPath) return anonymousAvatar;
            // Check if it's a URL (starts with http)
            if (avatarPath.startsWith('http')) {
                return avatarPath;
            }
            // For local avatars from assets
            const avatarModule = require(`../../assets/images/${avatarPath}`);
            return avatarModule.default || avatarModule;
        } catch (error) {
            return anonymousAvatar;
        }
    };

    useEffect(() => {
        const foundArticle = mainArticles.find(a => a.id === parseInt(id));
        if (!foundArticle) {
            navigate('/articles');
            return;
        }
        setArticle(foundArticle);
        setComments(foundArticle.comments || []);

        const savedLike = localStorage.getItem(`post-${id}-liked`);
        const savedLikes = localStorage.getItem(`post-${id}-likes`);

        setIsLiked(savedLike === 'true');
        setLikes(savedLikes ? parseInt(savedLikes) : 0);
    }, [id, navigate]);

    const handleLike = () => {
        const newLikedState = !isLiked;
        const newLikes = newLikedState ? likes + 1 : likes - 1;

        setIsLiked(newLikedState);
        setLikes(newLikes);

        localStorage.setItem(`post-${id}-liked`, String(newLikedState));
        localStorage.setItem(`post-${id}-likes`, newLikes.toString());
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: 'Check out this interesting article!',
                url: window.location.href,
            }).catch(err => console.log('Error sharing:', err));
        } else {
            const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`;
            window.open(shareUrl, '_blank');
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
    
        const now = new Date();
        const formattedDate = now.toLocaleString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).replace(',', ''); // Видаляємо кому між датою і часом
    
        const comment = {
            avatar: anonymousAvatar,
            author: 'Anonymous',
            text: newComment,
            date: formattedDate, // Форматована дата
        };
    
        setComments([comment, ...comments]);
        setNewComment('');
    
        const updatedArticle = {
            ...article,
            comments: [comment, ...(article.comments || [])],
        };
        localStorage.setItem('articlesData', JSON.stringify(
            mainArticles.map(a => a.id === updatedArticle.id ? updatedArticle : a)
        ));
    };

    if (!article) return <div>Loading...</div>;

    return (
        <div className="post-page">
            <article className="post">
                <div className="post-header">
                    <h1 className="post-title">{article.title}</h1>
                </div>

                <div className="post-image">
                    <img
                        src={getImageSource(article.img)}
                        alt={article.title}
                        onError={(e) => {
                            e.target.src = defaultPost;
                        }}
                    />
                </div>

                <div className="post-author">
                    <img
                        src={getAvatarSource(article.authorImg)}
                        alt={article.author}
                        className="post-in-author-avatar"
                        onError={(e) => {
                            e.target.src = anonymousAvatar;
                        }}
                    />
                    <div>
                        <div className="author-name">{article.author}</div>
                        <div className="author-title">Travel Writer</div>
                    </div>
                </div>

                <div className="post-content">
                    <p>{article.content}</p>
                </div>

                <section className="post-actions">
                    <div className="action-buttons">
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

                        <button className="share-btn" onClick={handleShare} aria-label="Share this post">
                            <svg className="share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                            </svg>
                        </button>
                    </div>
                </section>

                <section className="comments-section">
                    <h2 className="comments-title">Comments</h2>

                    <form className="add-comment-form" onSubmit={handleCommentSubmit}>
                        <h3 className="form-title">Add a comment</h3>
                        <div className="comments-form-group">
                            <textarea
                                className="comment-input"
                                placeholder="Write your comment here..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="submit-btn">Post Comment</button>
                        </div>
                    </form>

                    <div className="comments">
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={index} className="comment">
                                    <img
                                        src={getAvatarSource(comment.avatar)}
                                        alt={comment.author}
                                        className="comment-avatar"
                                        onError={(e) => {
                                            e.target.src = anonymousAvatar;
                                        }}
                                    />
                                    <div className="comment-content">
                                        <div className="comment-meta">
                                            <div className="comment-author">{comment.author}</div>
                                        </div>
                                        <div className="comment-text">{comment.text}</div>
                                        <div className="comment-date">{comment.date}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-comments">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </section>
            </article>
        </div>
    );
}

export default Post;