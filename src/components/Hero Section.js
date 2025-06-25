import React, { useState } from "react";
import "./HeroSection.css";
import config from "../config";

const HeroSection = () => {
  const games = [
    { id: 1, img: "/images/games/horizon.jpg" },
    { id: 2, img: "/images/consoles/ps5-digital.jpg" },
    { id: 3, img: "/images/accessories/dualsense.jpg" },
    { id: 4, img: "/images/games/god-of-war.jpg" },
  ];

  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const handleScroll = (direction) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentGameIndex((prev) =>
        direction === "up"
          ? prev === 0
            ? games.length - 1
            : prev - 1
          : prev === games.length - 1
          ? 0
          : prev + 1
      );
      setIsFading(false);
    }, 300);
  };

  return (
    <section className="hero-section">
      <div className="left-content">
        <h1>Gamesfast</h1>
        <p>Покупка никогда не была такой простой и быстрой</p>
        <div className="metrics">
          <div>430K+ Нас выбирают</div>
          <div>159K+ Игры</div>
          <div>87 Сотрудники</div>
        </div>
      </div>

      <div className="right-content">
        <div className="game-label">НОВИНКИ</div>
        <div className="game-container">
          <img
            src={config.getImageUrl(games[currentGameIndex].img)}
            alt="Game"
            className={`main-image ${isFading ? "fade" : ""}`}
          />
        </div>
        <div className="arrow-container">
          <button className="arrow up" onClick={() => handleScroll("up")}>↑</button>
          <button className="arrow down" onClick={() => handleScroll("down")}>↓</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
