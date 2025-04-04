import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import '../../styles/Forms.css';
import './RegistrationForm.css';

function RegistrationForm() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // File size validation (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Файл занадто великий. Максимальний розмір - 5MB.');
            return;
        }

        // File type validation
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('Будь ласка, виберіть зображення у форматі JPG, PNG або GIF.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Minimum dimensions validation
                if (img.width < 200 || img.height < 200) {
                    alert('Зображення занадто мале. Мінімальний розмір - 200×200px.');
                    return;
                }
                setPreviewImage(event.target.result);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('highlight');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('highlight');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('highlight');

        if (e.dataTransfer.files?.[0]) {
            // Create new file list
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(e.dataTransfer.files[0]);
            fileInputRef.current.files = dataTransfer.files;

            // Trigger change event
            const event = new Event('change', { bubbles: true });
            Object.defineProperty(event, 'target', {
                writable: false,
                value: fileInputRef.current
            });
            handleImageChange(event);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', { ...formData, avatar: previewImage });
        // Navigate to another page or show success message
    };

    return (
        <div className="lets-chat-page">
            <Header />

            <div className="container">
                <div className="left-column">
                    <h1>Оберіть свій аватар</h1>

                    <div className="avatar-selection">
                        <div className="avatar-preview-container">
                            <div className="avatar-preview">
                                <img
                                    src={previewImage || '../../icons/anonymous.png'}
                                    alt="Ваш аватар"
                                />
                            </div>
                        </div>

                        <div
                            className="upload-area"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                        >
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
                                className="hidden"
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
                        <label htmlFor="phone">Ваш номер телефону</label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Телефон"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Розкажіть про себе</label>
                        <textarea
                            id="message"
                            placeholder="Напишіть трохи про себе та свої інтереси"
                            value={formData.message}
                            onChange={handleInputChange}
                        />
                    </div>

                    <p className="note">
                        Натискаючи кнопку реєстрації, ви погоджуєтесь з нашими умовами
                        використання.
                    </p>

                    <button type="submit" className="cta-button">Зареєструватися</button>
                </form>
            </div>

            <Footer />
        </div>
    );
}

export default RegistrationForm;