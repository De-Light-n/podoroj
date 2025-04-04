import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Footer.css"


function Footer() {
    const navigate = useNavigate();

    const redirectToChat = () => {
        navigate('/letschat');
    };

    return (
        <footer className="footer">
            {/* Верхній рядок */}
            <div className="footer-top">
                <p>hello@podoroj.com • Відкрий світ разом з нами • hello@podoroj.com</p>
            </div>

            {/* Основний контент */}
            <div className="footer-content">
                <div className="footer-left">
                    <h2 className="footer-title">Мандруй. Досліджуй. Відкривай.</h2>
                    <button className="chat-btn" onClick={redirectToChat}>
                        Написати нам →
                    </button>
                </div>

                <div className="footer-nav">
                    <h4>НАВІГАЦІЯ</h4>
                    <ul>
                        <li><Link to="/about">Про нас</Link></li>
                        <li><Link to="/articles">Статті</Link></li>
                        <li><Link to="/gallery">Фотогалерея</Link></li>
                        <li><Link to="/articles">Популярні напрямки</Link></li>
                        <li><Link to="/articles">Путівники</Link></li>
                        <li><Link to="/letschat">Контакти</Link></li>
                    </ul>
                </div>

                <div className="footer-services">
                    <h4>ЩО МИ ПРОПОНУЄМО</h4>
                    <ul>
                        <li><Link to="/articles">Поради для подорожей</Link></li>
                        <li><Link to="/articles">Бюджетні маршрути</Link></li>
                        <li><Link to="/articles">Огляди міст</Link></li>
                        <li><Link to="/articles">Гастрономічні тури</Link></li>
                        <li><Link to="/articles">Екскурсії</Link></li>
                        <li><Link to="/articles">Авторські путівники</Link></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4>КОНТАКТИ</h4>
                    <p>+38 067 123 45 67</p>
                    <p>
                        <a href="mailto:hello@podoroj.com">hello@podoroj.com</a>
                    </p>
                    <p>
                        вул. Степана Бандери, 10 <br/>
                        Львів, Україна <br/>
                        01001
                    </p>
                </div>
            </div>

            {/* Нижня частина */}
            <div className="footer-bottom">
                <p>© Podoroj 2025 <Link to="/privacy">ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ</Link></p>
                <p>ДИЗАЙН ТА РОЗРОБКА ⚡ <a href="https://webstudio.example.com">WEBSTUDIO</a></p>
            </div>

            {/* Великий напис на фоні */}
            <div className="footer-bg-text">Podoroj</div>
        </footer>
    );
}

export default Footer;