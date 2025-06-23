import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SubscriptionsPage.css";

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const navigate = useNavigate();

  const durations = [1, 3, 6, 12];

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/subscriptions");
        if (!response.ok) {
          throw new Error("Не удалось загрузить подписки");
        }
        const data = await response.json();
        
        // Группируем подписки по типу (Essential, Extra, Premium)
        const groupedSubscriptions = data.reduce((acc, sub) => {
          const name = sub.name.split(" (")[0]; // Получаем имя без длительности
          const duration = parseInt(sub.name.match(/\((\d+)/)[1]); // Получаем длительность из названия
          
          if (!acc[name]) {
            acc[name] = {
              id: sub.id,
              name: name,
              imageUrl: sub.imageUrl,
              stockQuantity: sub.stockQuantity,
              prices: {}
            };
          }
          acc[name].prices[duration] = sub.price;
          return acc;
        }, {});

        setSubscriptions(Object.values(groupedSubscriptions));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const handlePurchase = async (subscription) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        navigate("/login");
        return;
      }

      // Находим ID подписки с выбранной длительностью
      const response = await fetch("http://localhost:5000/api/subscriptions");
      const allSubscriptions = await response.json();
      const selectedSubscription = allSubscriptions.find(s => 
        s.name === `${subscription.name} (${selectedDuration} ${
          selectedDuration === 1 ? 'месяц' : 
          selectedDuration < 5 ? 'месяца' : 
          'месяцев'
        })`
      );

      if (!selectedSubscription) {
        throw new Error("Не удалось найти подписку с выбранной длительностью");
      }

      const cartItem = {
        productId: selectedSubscription.id,
        quantity: 1,
        subscriptionDuration: selectedDuration
      };

      const cartResponse = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cartItem),
      });

      if (!cartResponse.ok) {
        const errorData = await cartResponse.text();
        console.error('Error response:', errorData);
        throw new Error(`Не удалось добавить подписку в корзину: ${errorData}`);
      }

      alert("Подписка добавлена в корзину!");
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDuration = (months) => {
    if (months === 1) return "1 месяц";
    if (months < 5) return `${months} месяца`;
    return `${months} месяцев`;
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;

  return (
    <section className="subscriptions-page">
      <h2>Подписки</h2>
      
      <div className="duration-selector-container">
        <div className="duration-selector">
          {durations.map((duration) => (
            <button
              key={duration}
              className={`duration-btn ${selectedDuration === duration ? 'active' : ''}`}
              onClick={() => setSelectedDuration(duration)}
            >
              {formatDuration(duration)}
            </button>
          ))}
        </div>
      </div>

      <div className="subscriptions-wrapper">
        <div className="subscriptions-container">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="subscription-card">
              <img src={`http://localhost:5000${subscription.imageUrl}`} alt={subscription.name} />
              <div className="subscription-info">
                <div className="subscription-details">
                  <div className="subscription-name">
                    {subscription.name}
                  </div>
                  <div className="subscription-price">
                    Цена: {subscription.prices[selectedDuration].toFixed(2)} BYN
                  </div>
                  <div
                    className={`subscription-stock ${subscription.stockQuantity > 0 ? "in-stock" : "out-of-stock"}`}
                  >
                    {subscription.stockQuantity > 0 ? "В наличии" : "Нет в наличии"}
                  </div>
                </div>
                <button 
                  className="buy-btn" 
                  disabled={subscription.stockQuantity <= 0}
                  onClick={() => handlePurchase(subscription)}
                >
                  Купить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionsPage;