import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Функция для проверки статуса авторизации
  const checkAuthStatus = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setIsLoggedIn(true);
      setIsAdmin(user.role === 'Admin');
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Проверяем статус при монтировании компонента и при изменении маршрута
    checkAuthStatus();

    // Добавляем слушатель события storage
    window.addEventListener('storage', checkAuthStatus);

    // Добавляем слушатель собственного события
    window.addEventListener('localStorageChange', checkAuthStatus);

    // Очищаем слушатели при размонтировании компонента
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('localStorageChange', checkAuthStatus);
    };
  }, [location.pathname]); // Добавляем зависимость от пути

  const handleAccountClick = () => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="header">
      {/* Логотип PS как ссылка на главную страницу */}
      <div className="logo">
        <Link to="/" className="logo-link">
          PS
        </Link>
      </div>

      <nav>
        <ul>
          {/* Все пункты меню как простой текст */}
          <li>
            <Link to="/games" className="menu-item">
              Игры
            </Link>
          </li>
          <li>
            <Link to="/accessories" className="menu-item">
              Аксессуары
            </Link>
          </li>
          <li>
            <Link to="/subscriptions" className="menu-item">
              Подписки
            </Link>
          </li>
          <li>
            <Link to="/consoles" className="menu-item">
              Консоли
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/admin" className="menu-item admin-link">
                Админ панель
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="search">
        <input type="text" placeholder="Поиск" />
      </div>
      <button onClick={handleAccountClick} className="account-button">
        {isLoggedIn ? "ПРОФИЛЬ" : "АККАУНТ"}
      </button>
    </header>
  );
};

export default Header;