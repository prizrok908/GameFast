import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ConsolesPage.css"; // Убедитесь, что путь к CSS указан правильно

const ConsolesPage = () => {
  const [consoles, setConsoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsoles = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/consoles");
        if (!response.ok) {
          throw new Error("Не удалось загрузить консоли");
        }
        const data = await response.json();
        setConsoles(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchConsoles();
  }, []);

  const handlePurchase = async (console) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        navigate("/login");
        return;
      }

      const cartItem = {
        productId: console.id,
        quantity: 1
      };

      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(errorData || `Не удалось добавить товар в корзину`);
      }

      alert("Товар добавлен в корзину!");
      window.location.reload();
    } catch (err) {
      setError(err.message);
      alert(err.message);
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  return (
    <section className="consoles-page">
      <h2>Консоли</h2>
      <div className="consoles-container"> {/* Используем класс .consoles-container */}
        {consoles.map((consoleItem) => (
          <div key={consoleItem.id} className="console-card">
            <img src={`http://localhost:5000${consoleItem.imageUrl}`} alt={consoleItem.name} />
            <div className="console-info">
              <div className="console-details">
                <div className="console-name">{consoleItem.name}</div>
                <div className="console-price">Цена: {consoleItem.priceDisplay}</div>
                <div
                  className={`console-stock ${consoleItem.stockQuantity > 0 ? "in-stock" : "out-of-stock"}`}
                >
                  {consoleItem.stockQuantity > 0 ? "В наличии" : "Нет в наличии"}
                </div>
              </div>
              <button 
                className="buy-btn" 
                disabled={consoleItem.stockQuantity <= 0}
                onClick={() => handlePurchase(consoleItem)}
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

export default ConsolesPage;