import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../../components/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import defaultPost from "../../assets/images/default-post.jpg";
import anonymousAvatar from "../../assets/icons/anonymous.png";
import "../../styles/styles.css";
import "./Post.css";
import LoadingPage from "../../components/LoadingPage/LoadingPage";

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = doc(db, "posts", id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          navigate("/articles");
          return;
        }

        const postData = postSnap.data();
        setPost({
          id: postSnap.id,
          ...postData,
          createdAt: postData.createdAt?.toDate(),
        });
        setLikes(postData.likes || 0);
        setIsLiked(
          user ? postData.likedBy?.includes(user.uid) || false : false
        );
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/articles");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id, navigate, user]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, "posts", id, "comments");
        const q = query(commentsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const commentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsList);
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    };

    if (id) fetchComments();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const postRef = doc(db, "posts", id);
      const newLikedState = !isLiked;
      const newLikes = newLikedState ? likes + 1 : likes - 1;

      await updateDoc(postRef, {
        likes: newLikes,
        likedBy: newLikedState ? arrayUnion(user.uid) : arrayRemove(user.uid),
      });

      setIsLiked(newLikedState);
      setLikes(newLikes);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleShare = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: "Check out this interesting post!",
          url: window.location.href,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        post.title
      )}&url=${encodeURIComponent(window.location.href)}`;
      window.open(shareUrl, "_blank");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const commentsRef = collection(db, "posts", id, "comments");
      await addDoc(commentsRef, {
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorAvatar: user.photoURL || null,
        text: newComment.trim(),
        createdAt: serverTimestamp(),
      });

      setNewComment("");
      // Refresh comments
      const q = query(commentsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error adding comment:", error);
      if (error.code === 'permission-denied') {
        alert("You don't have permission to comment. Please check if you're logged in.");
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    
    const dateObj = date?.toDate?.() || 
                   (date?.seconds ? new Date(date.seconds * 1000) : null) || 
                   new Date(date);
    
    return dateObj.toLocaleString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).replace(",", "");
};

  if (loading) return <LoadingPage/>;
  if (!post) return <div className="error">Post not found</div>;

  return (
    <div className="post-page">
      <article className="post">
        <div className="post-header">
          <h1 className="post-title">{post.title}</h1>
        </div>

        <div className="post-image">
          <img
            src={post.imageUrl || defaultPost}
            alt={post.title}
            onError={(e) => {
              e.target.src = defaultPost;
            }}
          />
        </div>

        <div className="post-author">
          <img
            src={post.authorAvatar || anonymousAvatar}
            alt={post.authorName}
            className="post-in-author-avatar"
            onError={(e) => {
              e.target.src = anonymousAvatar;
            }}
          />
          <div>
            <div className="author-name">{post.authorName}</div>
            <div className="author-title">Travel Writer</div>
          </div>
        </div>

        <div className="post-content">
          <p>{post.content}</p>
        </div>

        <section className="post-actions">
          <div className="action-buttons">
            <button
              className={`like-btn ${isLiked ? "active" : ""}`}
              onClick={handleLike}
              aria-label="Like this post"
            >
              <svg className="like-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill={isLiked ? "#ff4757" : "currentColor"}
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
              <span className="like-count">{likes}</span>
            </button>

            <button
              className="share-btn"
              onClick={handleShare}
              aria-label="Share this post"
            >
              <svg className="share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
                />
              </svg>
            </button>
          </div>
        </section>

        <section className="comments-section">
          <h2 className="comments-title">Comments</h2>

          {user ? (
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
                <button type="submit" className="submit-btn">
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="auth-required-message">
              <p>
                Please <button className="text-button" onClick={() => navigate("/login")}>sign in</button> to leave a comment.
              </p>
            </div>
          )}

          <div className="comments">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <img
                    src={comment.authorAvatar || anonymousAvatar}
                    alt={comment.authorName}
                    className="comment-avatar"
                    onError={(e) => {
                      e.target.src = anonymousAvatar;
                    }}
                  />
                  <div className="comment-content">
                    <div className="comment-meta">
                      <div className="comment-author">{comment.authorName}</div>
                      <div className="comment-date">{formatDate(comment.createdAt)}</div>
                    </div>
                    <div className="comment-text">{comment.text}</div>
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