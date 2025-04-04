import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import '../../styles/Forms.css';
import './LetsChat.css';

function LetsChat() {
    const navigate = useNavigate();
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Тут можна додати логіку відправки форми
        navigate('/thank-you'); // Перенаправлення після відправки
    };

    const redirectToChat = () => {
        navigate('/letschat');
    };

    return (
        <div className="lets-chat-page">
            <Header />

            <div className="container">
                <div className="left-column">
                    <div className="lets-chat-left-column">
                        <h1>Давайте поспілкуємось</h1>
                        <p className="intro">
                            Це нічого не коштує. Подорожі починаються з розмови!
                        </p>

                        <div className="contact-info">
                            <div className="contact-block">
                                <strong>hello@podoroj.com</strong>
                                <p>+38 098 123 45 67</p>
                            </div>
                            <div className="contact-block">
                                <strong>Офіс TravelBlog</strong>
                                <p>вул. Степана Бандери, 10, Львів, Україна</p>
                            </div>
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
                        <label htmlFor="email">Ваша електронна пошта?</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Електронна адреса"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Ваш номер телефону?</label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Номер телефону"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Про що ви хочете розповісти?</label>
                        <textarea
                            id="message"
                            placeholder="Поділіться своїми враженнями про подорож або запитайте нас про нові маршрути!"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <p className="note">
                        Натискаючи кнопку, ви погоджуєтесь, що ми можемо використати ваші дані
                        для зв'язку з вами.
                    </p>

                    <button type="submit" className="cta-button">Надіслати повідомлення</button>
                </form>
            </div>

            <Footer redirectToChat={redirectToChat} />
        </div>
    );
}

export default LetsChat;