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
    navigate("/podoroj/register");
  };

  const handleAvatarClick = () => {
    setAvatarDropdownOpen(!avatarDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/podoroj/");
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
      navigate("/podoroj/gallery");
    }
  };

  const articlesData = [
    {
      title: "Подорожі",
      links: [
        { to: "/podoroj/articles/latest", text: "Останні статті" },
        { to: "/podoroj/articles/popular", text: "Популярне" },
        { to: "/podoroj/articles/recommended", text: "Рекомендовані місця" },
        { to: "/podoroj/articles/adventure", text: "Екстремальні подорожі" },
        { to: "/podoroj/articles/road-trips", text: "Автомандрівки" },
        { to: "/podoroj/articles", text: "Переглянути всі", className: "view-all" },
      ],
    },
    {
      title: "Поради",
      links: [
        { to: "/podoroj/articles/budget-travel", text: "Бюджетні подорожі" },
        { to: "/podoroj/articles/saving-tips", text: "Як зекономити" },
        { to: "/podoroj/articles/packing-list", text: "Що взяти в дорогу" },
        { to: "/podoroj/articles/safety", text: "Безпека у подорожах" },
        { to: "/podoroj/articles/insurance", text: "Туристичні страховки" },
        {
          to: "/podoroj/articles/tips",
          text: "Переглянути всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Культура & Їжа",
      links: [
        { to: "/podoroj/articles/traditions", text: "Місцеві традиції" },
        { to: "/podoroj/articles/world-cuisine", text: "Кухні світу" },
        { to: "/podoroj/articles/restaurants", text: "Ресторани та кафе" },
        { to: "/podoroj/articles/food-tours", text: "Гастрономічні тури" },
        { to: "/podoroj/articles/festivals", text: "Фестивалі та свята" },
        {
          to: "/podoroj/articles/culture",
          text: "Переглянути всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Путівники",
      links: [
        { to: "/podoroj/articles/city-guides", text: "Маршрути по містах" },
        { to: "/podoroj/articles/hiking", text: "Похідні маршрути" },
        { to: "/podoroj/articles/excursions", text: "Екскурсії" },
        { to: "/podoroj/articles/weekend", text: "Вихідні подорожі" },
        { to: "/podoroj/articles/seasonal", text: "Сезонні путівники" },
        {
          to: "/podoroj/articles/guides",
          text: "Переглянути всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Життя в дорозі",
      links: [
        { to: "/podoroj/articles/digital-nomad", text: "Робота у подорожах" },
        { to: "/podoroj/articles/long-term", text: "Довготривалі подорожі" },
        { to: "/podoroj/articles/volunteering", text: "Волонтерські програми" },
        { to: "/podoroj/articles/backpacking", text: "Бекпекінг" },
        { to: "/podoroj/articles/minimalism", text: "Мінімалізм у подорожах" },
        {
          to: "/podoroj/articles/life-on-road",
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
        { to: "/podoroj/destinations/italy", text: "Італія" },
        { to: "/podoroj/destinations/france", text: "Франція" },
        { to: "/podoroj/destinations/spain", text: "Іспанія" },
        { to: "/podoroj/destinations/germany", text: "Німеччина" },
        { to: "/podoroj/destinations/ukraine", text: "Україна" },
        {
          to: "/podoroj/destinations/europe",
          text: "Дивитися всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Азія",
      links: [
        { to: "/podoroj/destinations/thailand", text: "Таїланд" },
        { to: "/podoroj/destinations/india", text: "Індія" },
        { to: "/podoroj/destinations/japan", text: "Японія" },
        { to: "/podoroj/destinations/vietnam", text: "В'єтнам" },
        { to: "/podoroj/destinations/indonesia", text: "Індонезія" },
        {
          to: "/podoroj/destinations/asia",
          text: "Дивитися всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Америка",
      links: [
        { to: "/podoroj/destinations/usa", text: "США" },
        { to: "/podoroj/destinations/brazil", text: "Бразилія" },
        { to: "/podoroj/destinations/mexico", text: "Мексика" },
        { to: "/podoroj/destinations/canada", text: "Канада" },
        { to: "/podoroj/destinations/argentina", text: "Аргентина" },
        {
          to: "/podoroj/destinations/america",
          text: "Дивитися всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Африка",
      links: [
        { to: "/podoroj/destinations/egypt", text: "Єгипет" },
        { to: "/podoroj/destinations/kenya", text: "Кенія" },
        { to: "/podoroj/destinations/morocco", text: "Марокко" },
        { to: "/podoroj/destinations/south-africa", text: "ПАР" },
        { to: "/podoroj/destinations/tanzania", text: "Танзанія" },
        {
          to: "/podoroj/destinations/africa",
          text: "Дивитися всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Океанія",
      links: [
        { to: "/podoroj/destinations/australia", text: "Австралія" },
        { to: "/podoroj/destinations/new-zealand", text: "Нова Зеландія" },
        { to: "/podoroj/destinations/fiji", text: "Фіджі" },
        { to: "/podoroj/destinations/bali", text: "Балі" },
        { to: "/podoroj/destinations/samoa", text: "Самоа" },
        {
          to: "/podoroj/destinations/oceania",
          text: "Дивитися всі",
          className: "view-all",
        },
      ],
    },
    {
      title: "Полярні регіони",
      links: [
        { to: "/podoroj/destinations/antarctica", text: "Антарктида" },
        { to: "/podoroj/destinations/arctic", text: "Арктика" },
        { to: "/podoroj/destinations/iceland", text: "Ісландія" },
        { to: "/podoroj/destinations/greenland", text: "Гренландія" },
        { to: "/podoroj/destinations/norway", text: "Північна Норвегія" },
        {
          to: "/podoroj/destinations/polar",
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
              to="/podoroj/articles"
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
              to="/podoroj/destinations"
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
            <Link to="/podoroj/gallery" onClick={handleGalleryClick}>
              Фотогалерея
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/podoroj/about">Про нас</Link>
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
