import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AccessoriesPage.css"; // Убедитесь, что путь к CSS указан правильно

const AccessoriesPage = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/accessories");
        if (!response.ok) {
          throw new Error("Не удалось загрузить аксессуары");
        }
        const data = await response.json();
        setAccessories(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAccessories();
  }, []);

  const handlePurchase = async (accessory) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        navigate("/login");
        return;
      }

      const cartItem = {
        productId: accessory.id,
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
    <section className="accessories-page">
      <h2>Аксессуары</h2>
      <div className="accessories-container">
        {accessories.map((accessory) => (
          <div key={accessory.id} className="accessory-card">
            <img src={`http://localhost:5000${accessory.imageUrl}`} alt={accessory.name} />
            <div className="accessory-info">
              <div className="accessory-details">
                <div className="accessory-name">{accessory.name}</div>
                <div className="accessory-price">Цена: {accessory.priceDisplay}</div>
                <div
                  className={`accessory-stock ${accessory.stockQuantity > 0 ? "in-stock" : "out-of-stock"}`}
                >
                  {accessory.stockQuantity > 0 ? "В наличии" : "Нет в наличии"}
                </div>
              </div>
              <button 
                className="buy-btn" 
                disabled={accessory.stockQuantity <= 0}
                onClick={() => handlePurchase(accessory)}
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

export default AccessoriesPage;