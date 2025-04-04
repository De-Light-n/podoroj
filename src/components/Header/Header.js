import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Dropdown = ({ title, children, to }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    let timeoutId;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const showMenu = () => {
        clearTimeout(timeoutId);
        setIsOpen(true);
    };

    const hideMenu = () => {
        timeoutId = setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    return (
        <li
            className="nav-item dropdown"
            ref={dropdownRef}
            onMouseEnter={showMenu}
            onMouseLeave={hideMenu}
        >
            <Link to={to}>{title} +</Link>
            <div
                className={`dropdown-menu ${isOpen ? 'open' : ''}`}
                onMouseEnter={showMenu}
                onMouseLeave={hideMenu}
            >
                {children}
            </div>
        </li>
    );
};

const DropdownElement = ({ title, links }) => {
    return (
        <div className="dropdown-element">
            <h4>{title}</h4>
            {links.map((link, index) => (
                <Link
                    key={index}
                    to={link.to}
                    className={link.className}
                >
                    {link.text}
                </Link>
            ))}
        </div>
    );
};

function Header() {
    const navigate = useNavigate();

    const articlesData = [
        {
            title: "Подорожі",
            links: [
                { to: "/articles/latest", text: "Останні статті" },
                { to: "/articles/popular", text: "Популярне" },
                { to: "/articles/recommended", text: "Рекомендовані місця" },
                { to: "/articles", text: "Переглянути всі", className: "view-all" }
            ]
        },
        {
            title: "Поради",
            links: [
                { to: "/articles/budget-travel", text: "Бюджетні подорожі" },
                { to: "/articles/saving-tips", text: "Як зекономити" },
                { to: "/articles/packing-list", text: "Що взяти в дорогу" },
                { to: "/articles/tips", text: "Переглянути всі", className: "view-all" }
            ]
        },
        // Add other sections similarly
    ];

    const directionsData = [
        {
            title: "Європа",
            links: [
                { to: "/destinations/italy", text: "Італія" },
                { to: "/destinations/france", text: "Франція" },
                { to: "/destinations/spain", text: "Іспанія" },
                { to: "/destinations/europe", text: "Дивитися всі", className: "view-all" }
            ]
        },
        // Add other regions similarly
    ];

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <nav className="main-nav">
            <div className="logo" onClick={() => navigate('/')}>Podoroj</div>
            <div className="nav-center">
                <ul className="nav-links">
                    <Dropdown title="Статті" to="/articles">
                        {articlesData.map((section, index) => (
                            <DropdownElement
                                key={index}
                                title={section.title}
                                links={section.links}
                            />
                        ))}
                    </Dropdown>

                    <Dropdown title="Напрямки" to="/destinations">
                        {directionsData.map((section, index) => (
                            <DropdownElement
                                key={index}
                                title={section.title}
                                links={section.links}
                            />
                        ))}
                    </Dropdown>

                    <li className="nav-item">
                        <Link to="/gallery">Фотогалерея</Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/about">Про нас</Link>
                    </li>
                </ul>
            </div>
            <button onClick={handleRegisterClick} className="cta-button">
                Зареєструватися
            </button>
        </nav>
    );
}

export default Header;