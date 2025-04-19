import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../components/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import "../../styles/Forms.css";
import "./CreatePost.css";

function CreatePost() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Перевіряємо стан автентифікації
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/podoroj/login");
        return;
      }
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];

    if (!file) {
      alert("Файл не вибрано.");
      return;
    }

    // Валідація типу файлу
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Будь ласка, виберіть зображення у форматі JPG, PNG або GIF.");
      return;
    }

    // Валідація розміру файлу (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Файл занадто великий. Максимальний розмір - 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Функція для завантаження зображення в Firebase Storage
  const uploadImage = async (file) => {
    if (!file) return null;

    const storageRef = ref(
      storage,
      `posts/${user.uid}/${Date.now()}_${file.name}`
    );
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !previewImage) return;

    setLoading(true);
    try {
      const file = fileInputRef.current.files[0];
      const imageUrl = await uploadImage(file);

      const postData = {
        title: formData.title,
        content: formData.description,
        tags: formData.tags.split(" ").filter((tag) => tag.startsWith("#")),
        imageUrl: imageUrl,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorAvatar: user.photoURL || null,
        createdAt: serverTimestamp(),
        comments: [],
        likes: 0,
        likedBy: [],
      };

      // Додаємо пост у колекцію 'posts'
      const docRef = await addDoc(collection(db, "posts"), postData);
      console.log("Post created with ID: ", docRef.id);

      navigate(`/podoroj/post/${docRef.id}`);
    } catch (error) {
      console.error("Error creating post: ", error);
      alert("Помилка при створенні посту: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageChange(e);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="create-post-page">
      <div className="container">
        <div className="left-column">
          <h1>Поділіться своєю історією подорожі</h1>

          <div className="image-upload-section">
            <div
              className={`upload-area ${isDragging ? "highlight" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <div className="upload-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="#ff7e5f"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p>Перетягніть фото вашої пригоди сюди або</p>
              <button
                type="button"
                className="upload-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
              >
                Обрати файл
              </button>
              <input
                type="file"
                id="image"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {previewImage && (
              <div className="image-preview">
                <img
                  src={previewImage}
                  alt="Попередній перегляд"
                  onError={() => setPreviewImage(null)}
                />
              </div>
            )}
          </div>
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Заголовок історії</label>
            <input
              type="text"
              id="title"
              placeholder="Наприклад: Мої пригоди в Ісландії"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Розкажіть про свою подорож</label>
            <textarea
              id="description"
              placeholder="Поділіться враженнями, цікавими моментами та корисними порадами..."
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Додайте теги</label>
            <textarea
              id="tags"
              placeholder="Наприклад: #гори #автостоп #бюджетнаподорож"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </div>

          <p className="note">
            Натискаючи «Зберегти», ви дозволяєте опублікувати вашу історію на
            сайті, щоб надихати інших мандрівників!
          </p>

          <button type="submit" className="cta-button" disabled={loading}>
            {loading ? "Збереження..." : "Зберегти історію"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
