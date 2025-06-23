import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AllProducts.css";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/products");

        if (!response.ok) {
          throw new Error("Не удалось загрузить товары");
        }

        const data = await response.json();
        // Фильтруем товары, у которых есть все необходимые данные
        const validProducts = data.filter(product => 
          product.name && 
          product.imageUrl && 
          product.price && 
          product.priceDisplay &&
          product.type &&
          product.id
        );
        // Перемешиваем массив товаров и берем первые 8
        const shuffledProducts = validProducts.sort(() => Math.random() - 0.5).slice(0, 8);
        setProducts(shuffledProducts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePurchase = async (product) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        navigate("/login");
        return;
      }

      const cartItem = {
        productId: product.id,
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
    <section className="all-products">
      <h2>Популярные товары</h2>
      <div className="products-container">
        {products.map((product) => (
          <div key={`${product.type}-${product.id}`} className="product-card">
            {/* Изображение */}
            <img src={product.imageUrl} alt={product.name} />

            {/* Информация о товаре */}
            <div className="product-info">
              <div className="product-details">
                <div className="product-name">{product.name}</div>
                <div className="product-price">
                  Цена: {product.priceDisplay}
                </div>
                <div className={`product-stock ${product.stockQuantity > 0 ? "in-stock" : "out-of-stock"}`}>
                  {product.stockQuantity > 0 ? "В наличии" : "Нет в наличии"}
                </div>
              </div>

              {/* Кнопка "Купить" справа */}
              <button 
                className="buy-btn" 
                disabled={product.stockQuantity <= 0}
                onClick={() => handlePurchase(product)}
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

export default AllProducts;