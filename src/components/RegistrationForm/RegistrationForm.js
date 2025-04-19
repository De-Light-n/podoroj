import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import anonymousAvatar from "../../assets/icons/anonymous.png";
import "../../styles/Forms.css";
import "./RegistrationForm.css";
import { auth, googleProvider, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function RegistrationForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Файл занадто великий. Максимальний розмір - 5MB.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Будь ласка, виберіть зображення у форматі JPG, PNG або GIF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 200 || img.height < 200) {
          alert("Зображення занадто мале. Мінімальний розмір - 200×200px.");
          return;
        }
        setPreviewImage(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file, userId) => {
    const storageRef = ref(storage, `avatars/${userId}/profile.jpg`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Реєстрація користувача
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;
      let photoURL = null;
  
      // 2. Завантаження аватара (якщо є)
      if (previewImage && fileInputRef.current.files[0]) {
        photoURL = await uploadImage(fileInputRef.current.files[0], user.uid);
      }
  
      // 3. Оновлення профілю з displayName та photoURL
      await updateProfile(user, {
        displayName: formData.name, // Тут зберігаємо нікнейм
        photoURL: photoURL || anonymousAvatar
      });
  
      navigate("/");
    } catch (error) {
      console.error("Помилка реєстрації:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      navigate("/");
      return result;
    } catch (error) {
      console.error("Помилка реєстрації через Google:", error.message);
      alert(`Помилка реєстрації через Google: ${error.message}`);
    }
  };

  return (
    <div className="lets-chat-page">
      <div className="container">
        <div className="left-column">
          <h1>Оберіть свій аватар</h1>

          <div className="avatar-selection">
            <div className="avatar-preview-container">
              <div className="avatar-preview">
                <img
                  id="avatar-preview"
                  src={previewImage || anonymousAvatar}
                  alt="Ваш аватар"
                />
              </div>
            </div>

            <div className="upload-avatar">
              <label htmlFor="avatar-upload" className="upload-btn">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Вибрати зображення
              </label>
              <input
                type="file"
                id="avatar-upload"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>

            <div className="avatar-requirements">
              <p>Рекомендовано:</p>
              <ul>
                <li>Формат: JPG, PNG</li>
                <li>Розмір: до 5MB</li>
                <li>Мінімальний розмір: 200×200px</li>
              </ul>
            </div>
          </div>
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Як вас звати?</label>
            <input
              type="text"
              id="name"
              placeholder="Ваше ім'я"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Ваша електронна пошта</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              placeholder="Придумайте пароль"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="6"
            />
          </div>

          <p className="note">
            Натискаючи кнопку реєстрації, ви погоджуєтесь з нашими умовами
            використання.
          </p>

          <div className="auth-buttons">
            <button type="submit" className="cta-button" disabled={loading}>
              {loading ? "Завантаження..." : "Зареєструватися"}
            </button>
            <button
              type="button"
              className="cta-button"
              id="signin-btn"
              onClick={() => navigate("/login")}
            >
              Я вже маю акаунт
            </button>
          </div>

          <div className="divider">
            <span>або</span>
          </div>

          <button
            type="button"
            className="google-signin-btn"
            onClick={handleGoogleSignUp}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5781 9.20578C17.5781 8.56641 17.5223 7.95234 17.4176 7.36328H9.17578V10.845H13.9062C13.7386 11.97 13.1098 12.9234 12.1195 13.5562V15.5639H14.9117C16.6043 14.0023 17.5781 11.7906 17.5781 9.20578Z"
                fill="#4285F4"
              />
              <path
                d="M9.17578 18C11.4492 18 13.3594 17.1945 14.9117 15.5639L12.1195 13.5562C11.3514 14.0742 10.3633 14.3695 9.17578 14.3695C6.96094 14.3695 5.09766 12.8391 4.45195 10.8008H1.58203V12.8613C3.12305 15.9117 5.94141 18 9.17578 18Z"
                fill="#34A853"
              />
              <path
                d="M4.45195 10.8008C4.25977 10.2305 4.1543 9.6209 4.1543 9C4.1543 8.3791 4.25977 7.76953 4.45195 7.19922V5.13867H1.58203C0.949219 6.39844 0.578125 7.85273 0.578125 9C0.578125 10.1473 0.949219 11.6016 1.58203 12.8613L4.45195 10.8008Z"
                fill="#FBBC05"
              />
              <path
                d="M9.17578 3.63047C10.4648 3.63047 11.6133 4.06641 12.5273 4.92578L14.9648 2.48828C13.3555 0.985547 11.4492 0 9.17578 0C5.94141 0 3.12305 2.08828 1.58203 5.13867L4.45195 7.19922C5.09766 5.16094 6.96094 3.63047 9.17578 3.63047Z"
                fill="#EA4335"
              />
            </svg>
            Зареєструватися через Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;