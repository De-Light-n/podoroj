import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./Header.css";
import anonymousAvatar from "../../assets/icons/anonymous.png";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const Dropdown = ({ title, children, to, isOpen, setIsOpen }) => {
  const dropdownRef = useRef(null);

  return (
    <li className="nav-item dropdown" ref={dropdownRef}>
      <Link to={to} className="dropdown-trigger">
        {title} +
      </Link>
      <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>{children}</div>
    </li>
  );
};

const DropdownElement = ({ title, links }) => {
  return (
    <div className="dropdown-element">
      <h4>{title}</h4>
      {links.map((link, index) => (
        <Link key={index} to={link.to} className={link.className}>
          {link.text}
        </Link>
      ))}
    </div>
  );
};

function Header() {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const navRef = useRef();
  const avatarRef = useRef();

  // Відстежуємо стан автентифікації
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Обробник кліку поза випадаючим меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setAvatarDropdownOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.relatedTarget)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (name) => {
    setOpenDropdown(name);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleAvatarClick = () => {
    setAvatarDropdownOpen(!avatarDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      setAvatarDropdownOpen(false);
      window.location.reload();
      ScrollToTop();
    } catch (error) {
      console.error("Помилка при виході:", error);
    }
  };

  const handleGalleryClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/gallery");
    }
  };

  const articlesData = [
    {
      title: "Подорожі",
      links: [
        { to: "/articles/latest", text: "Останні статті" },
        { to: "/articles/popular", text: "Популярне" },
        { to: "/articles/recommended", text: "Рекомендовані місця" },
        { to: "/articles/adventure", text: "Екстремальні подорожі" },
        { to: "/articles/road-trips", text: "Автомандрівки" },
        { to: "/articles", text: "Переглянути всі", className: "view-all" },
      ],
    },
    {
      title: "Поради",
      links: [
        { to: "/articles/budget-travel", text: "Бюджетні подорожі" },
        { to: "/articles/saving-tips", text: "Як зекономити" },
        { to: "/articles/packing-list", text: "Що взяти в дорогу" },
        { to: "/articles/safety", text: "Безпека у подорожах" },
        { to: "/articles/insurance", text: "Туристичні страховки" },
        {
          to: "/articles/tips",
          text: "Переглянути всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Культура & Їжа",
      links: [
        { to: "/articles/traditions", text: "Місцеві традиції" },
        { to: "/articles/world-cuisine", text: "Кухні світу" },
        { to: "/articles/restaurants", text: "Ресторани та кафе" },
        { to: "/articles/food-tours", text: "Гастрономічні тури" },
        { to: "/articles/festivals", text: "Фестивалі та свята" },
        {
          to: "/articles/culture",
          text: "Переглянути всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Путівники",
      links: [
        { to: "/articles/city-guides", text: "Маршрути по містах" },
        { to: "/articles/hiking", text: "Похідні маршрути" },
        { to: "/articles/excursions", text: "Екскурсії" },
        { to: "/articles/weekend", text: "Вихідні подорожі" },
        { to: "/articles/seasonal", text: "Сезонні путівники" },
        {
          to: "/articles/guides",
          text: "Переглянути всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Життя в дорозі",
      links: [
        { to: "/articles/digital-nomad", text: "Робота у подорожах" },
        { to: "/articles/long-term", text: "Довготривалі подорожі" },
        { to: "/articles/volunteering", text: "Волонтерські програми" },
        { to: "/articles/backpacking", text: "Бекпекінг" },
        { to: "/articles/minimalism", text: "Мінімалізм у подорожах" },
        {
          to: "/articles/life-on-road",
          text: "Переглянути всі",
          className: "view-all",
        },
      ],
    },
  ];

  const directionsData = [
    {
      title: "Європа",
      links: [
        { to: "/destinations/italy", text: "Італія" },
        { to: "/destinations/france", text: "Франція" },
        { to: "/destinations/spain", text: "Іспанія" },
        { to: "/destinations/germany", text: "Німеччина" },
        { to: "/destinations/ukraine", text: "Україна" },
        {
          to: "/destinations/europe",
          text: "Дивитися всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Азія",
      links: [
        { to: "/destinations/thailand", text: "Таїланд" },
        { to: "/destinations/india", text: "Індія" },
        { to: "/destinations/japan", text: "Японія" },
        { to: "/destinations/vietnam", text: "В'єтнам" },
        { to: "/destinations/indonesia", text: "Індонезія" },
        {
          to: "/destinations/asia",
          text: "Дивитися всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Америка",
      links: [
        { to: "/destinations/usa", text: "США" },
        { to: "/destinations/brazil", text: "Бразилія" },
        { to: "/destinations/mexico", text: "Мексика" },
        { to: "/destinations/canada", text: "Канада" },
        { to: "/destinations/argentina", text: "Аргентина" },
        {
          to: "/destinations/america",
          text: "Дивитися всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Африка",
      links: [
        { to: "/destinations/egypt", text: "Єгипет" },
        { to: "/destinations/kenya", text: "Кенія" },
        { to: "/destinations/morocco", text: "Марокко" },
        { to: "/destinations/south-africa", text: "ПАР" },
        { to: "/destinations/tanzania", text: "Танзанія" },
        {
          to: "/destinations/africa",
          text: "Дивитися всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Океанія",
      links: [
        { to: "/destinations/australia", text: "Австралія" },
        { to: "/destinations/new-zealand", text: "Нова Зеландія" },
        { to: "/destinations/fiji", text: "Фіджі" },
        { to: "/destinations/bali", text: "Балі" },
        { to: "/destinations/samoa", text: "Самоа" },
        {
          to: "/destinations/oceania",
          text: "Дивитися всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Полярні регіони",
      links: [
        { to: "/destinations/antarctica", text: "Антарктида" },
        { to: "/destinations/arctic", text: "Арктика" },
        { to: "/destinations/iceland", text: "Ісландія" },
        { to: "/destinations/greenland", text: "Гренландія" },
        { to: "/destinations/norway", text: "Північна Норвегія" },
        {
          to: "/destinations/polar",
          text: "Дивитися всі",
          className: "view-all",
        },
      ],
    },
  ];

  return (
    <nav className="main-nav" ref={navRef}>
      <div className="logo" onClick={() => navigate("/")}>
        Podoroj
      </div>
      <div className="nav-center">
        <ul className="nav-links">
          <div onMouseEnter={() => handleMouseEnter("articles")}>
            <Dropdown
              title="Статті"
              to="/articles"
              isOpen={openDropdown === "articles"}
              setIsOpen={setOpenDropdown}
            >
              {articlesData.map((section, index) => (
                <DropdownElement
                  key={index}
                  title={section.title}
                  links={section.links}
                />
              ))}
            </Dropdown>
          </div>

          <div onMouseEnter={() => handleMouseEnter("destinations")}>
            <Dropdown
              title="Напрямки"
              to="/destinations"
              isOpen={openDropdown === "destinations"}
              setIsOpen={setOpenDropdown}
            >
              {directionsData.map((section, index) => (
                <DropdownElement
                  key={index}
                  title={section.title}
                  links={section.links}
                />
              ))}
            </Dropdown>
          </div>

          <li className="nav-item">
            <Link to="/gallery" onClick={handleGalleryClick}>
              Фотогалерея
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/about">Про нас</Link>
          </li>
        </ul>
      </div>

      {user ? (
        <div className="user-info">
          <div className="user-name">
            {user.displayName || user.email.split("@")[0]}
          </div>
          <div className="avatar-container" ref={avatarRef}>
            <img
              src={user.photoURL || anonymousAvatar}
              alt="Аватар"
              className="user-avatar"
              onClick={handleAvatarClick}
            />
            {avatarDropdownOpen && (
              <div className="avatar-dropdown">
                <button onClick={handleLogout} className="logout-button">
                  Вийти
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button onClick={handleRegisterClick} className="cta-button">
          Зареєструватися
        </button>
      )}
    </nav>
  );
}

export default Header;
