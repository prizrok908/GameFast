import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GamesPage.css"; // Убедитесь, что путь к CSS указан правильно

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/games");
        if (!response.ok) {
          throw new Error("Не удалось загрузить игры");
        }
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const handlePurchase = async (game) => {
    try {
      const userJson = localStorage.getItem("user");
      console.log('Raw user data from localStorage:', userJson);

      if (!userJson) {
        console.log('No user data found, redirecting to login');
        navigate("/login");
        return;
      }

      const cartItem = {
        productId: game.id,
        quantity: 1
      };

      console.log('Sending request:', cartItem);

      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cartItem),
      });

      console.log('Response status:', response.status);
      const contentType = response.headers.get("content-type");
      console.log('Response content type:', contentType);

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.text();
          console.error('Error response:', errorData);
          errorMessage = errorData;
        } catch (e) {
          console.error('Error reading error response:', e);
          errorMessage = 'Unknown error occurred';
        }
        throw new Error(`Не удалось добавить игру в корзину: ${errorMessage}`);
      }

      alert("Игра добавлена в корзину!");
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  return (
    <section className="games-page">
      <h2>Игры</h2>
      <div className="games-container"> {/* Используем класс .games-container */}
        {games.map((game) => (
          <div key={game.id} className="game-card">
            <img src={`http://localhost:5000${game.imageUrl}`} alt={game.name} />
            <div className="game-info">
              <div className="game-details">
                <div className="game-name">{game.name}</div>
                <div className="game-price">Цена: {game.priceDisplay}</div>
                <div
                  className={`game-stock ${game.stockQuantity > 0 ? "in-stock" : "out-of-stock"}`}
                >
                  {game.stockQuantity > 0 ? "В наличии" : "Нет в наличии"}
                </div>
              </div>
              <button 
                className="buy-btn" 
                disabled={game.stockQuantity <= 0}
                onClick={() => handlePurchase(game)}
              >
                Купить
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GamesPage;