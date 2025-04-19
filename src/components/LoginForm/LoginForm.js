import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Forms.css";
import "./LoginForm.css";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      navigate("/");
    } catch (error) {
      console.error("Помилка входу:", error);
      setError("Невірний email або пароль. Будь ласка, спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.error("Помилка входу через Google:", error.message);
      setError(`Помилка входу через Google: ${error.message}`);
    }
  };

  return (
    <div className="lets-chat-page">
      <div className="container">
        <div className="left-column">
          <h1>Ласкаво просимо назад!</h1>
          <p className="welcome-text">
            Раді знову вас бачити. Увійдіть, щоб продовжити спілкування з друзями.
          </p>
          <div className="illustration">
            <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 150L150 100L200 150" stroke="#4A6CF7" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="150" cy="70" r="30" fill="#4A6CF7" fillOpacity="0.1" stroke="#4A6CF7" strokeWidth="2"/>
              <path d="M150 100V70" stroke="#4A6CF7" strokeWidth="2" strokeLinecap="round"/>
              <path d="M50 50H250V170H50V50Z" stroke="#4A6CF7" strokeWidth="2" fill="none"/>
              <path d="M70 70H230V150H70V70Z" stroke="#4A6CF7" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Електронна пошта</label>
            <input
              type="email"
              id="email"
              placeholder="Ваш email"
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
              placeholder="Ваш пароль"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="auth-buttons">
            <button type="submit" className="cta-button" disabled={loading}>
              {loading ? "Вхід..." : "Увійти"}
            </button>
          </div>

          <p className="note">
            Ще не маєте акаунту?{" "}
            <span className="link" onClick={() => navigate("/podoroj/register")}>
              Зареєструватися
            </span>
          </p>

          <div className="divider">
            <span>або</span>
          </div>

          <button
            type="button"
            className="google-signin-btn"
            onClick={handleGoogleSignIn}
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
            Увійти через Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;