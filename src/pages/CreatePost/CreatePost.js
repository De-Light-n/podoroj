import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import '../../styles/Forms.css';
import './CreatePost.css';

function CreatePost() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
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

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            fileInputRef.current.files = e.dataTransfer.files;
            handleImageChange({ target: fileInputRef.current });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', { ...formData, image: previewImage });
        // Navigate to another page or show success message
    };

    return (
        <div className="create-post-page">
            <Header />

            <div className="container">
                <div className="left-column">
                    <h1>Поділіться своєю історією подорожі</h1>

                    <div className="image-upload-section">
                        <div
                            className="upload-area"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
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
                            <label htmlFor="image" className="upload-btn">Обрати файл</label>
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
                                <img src={previewImage} alt="Попередній перегляд" />
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
                        Натискаючи «Зберегти», ви дозволяєте опублікувати вашу історію на сайті, щоб надихати інших мандрівників!
                    </p>

                    <button type="submit" className="cta-button">Зберегти історію</button>
                </form>
            </div>

            <Footer />
        </div>
    );
}

export default CreatePost;