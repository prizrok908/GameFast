import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="logo">Gamesfast</div>
        <div className="links">
          <Link to="/policy">Политика компании</Link>
          <Link to="/support">Поддержка</Link>
          <Link to="/faq">Часто задаваемые вопросы</Link>
        </div>
        <div className="social-icons">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
        </div>
        <p>&copy; 2024 Sony Interactive Entertainment Europe Limited (SIEE)</p>
      </div>
    </footer>
  );
};

export default Footer;