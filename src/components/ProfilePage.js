// src/components/ProfilePage.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import defaultAvatar from '../assets/default-avatar.svg';
import './ProfilePage.css';
import config from '../config';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalAmountDisplay, setTotalAmountDisplay] = useState('0.00 BYN');
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('purchases');
    const [selectedItems, setSelectedItems] = useState(new Set());
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [quantityErrors, setQuantityErrors] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUserData();
    }, [navigate]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Получаем данные профиля
            const response = await fetch(`${config.API_URL}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                
                // Получаем историю покупок
                const purchasesResponse = await fetch(`${config.API_URL}/purchases`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (purchasesResponse.ok) {
                    const purchasesData = await purchasesResponse.json();
                    console.log('Purchases data:', purchasesData);
                    setPurchases(purchasesData);
                    const total = purchasesData.reduce((sum, purchase) => {
                        console.log('Processing purchase:', purchase);
                        return sum + (purchase.price * purchase.quantity);
                    }, 0);
                    console.log('Total amount:', total);
                    setTotalAmount(total);
                    const formattedTotal = Number(total).toFixed(2).replace(/\.?0+$/, '');
                    setTotalAmountDisplay(`${formattedTotal} BYN`);
                }

                // Получаем корзину
                const cartResponse = await fetch(`${config.API_URL}/cart`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (cartResponse.ok) {
                    const cartData = await cartResponse.json();
                    setCartItems(cartData);
                }
            } else if (response.status === 401) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                const data = await response.json();
                setError(data.message || 'Ошибка при загрузке профиля');
            }
        } catch (err) {
            setError('Ошибка сервера. Пожалуйста, попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        const cartItem = cartItems.find(item => item.id === itemId);
        if (!cartItem) {
            setQuantityErrors(prev => ({ ...prev, [itemId]: "Товар не найден в корзине" }));
            setTimeout(() => setQuantityErrors(prev => ({ ...prev, [itemId]: undefined })), 2000);
            return;
        }
        if (newQuantity > cartItem.stockQuantity) {
            setQuantityErrors(prev => ({ ...prev, [itemId]: "Нет такого количества в наличии" }));
            setTimeout(() => setQuantityErrors(prev => ({ ...prev, [itemId]: undefined })), 2000);
            return;
        }
        try {
            const response = await fetch(`${config.API_URL}/cart/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: itemId,
                    userId: JSON.parse(localStorage.getItem('user')).id,
                    productId: cartItem.productId,
                    quantity: newQuantity,
                    subscriptionDuration: cartItem.subscriptionDuration
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                setQuantityErrors(prev => ({ ...prev, [itemId]: errorData.message || 'Не удалось обновить количество товара' }));
                setTimeout(() => setQuantityErrors(prev => ({ ...prev, [itemId]: undefined })), 2000);
                return;
            }

            const updatedData = await response.json();
            setCartItems(cartItems.map(item =>
                item.id === itemId ? { ...item, quantity: updatedData.quantity } : item
            ));
        } catch (err) {
            setQuantityErrors(prev => ({ ...prev, [itemId]: err.message }));
            setTimeout(() => setQuantityErrors(prev => ({ ...prev, [itemId]: undefined })), 2000);
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            const response = await fetch(`${config.API_URL}/cart/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error("Не удалось удалить товар");
            }

            setCartItems(cartItems.filter(item => item.id !== itemId));
            setSelectedItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('userId', user.id);

        try {
            const response = await fetch(`${config.API_URL}/users/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Не удалось загрузить аватар");
            }

            const data = await response.json();
            setUser(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
            
            // Обновляем данные пользователя в localStorage
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userData = JSON.parse(userStr);
                userData.avatarUrl = data.avatarUrl;
                localStorage.setItem('user', JSON.stringify(userData));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('localStorageChange'));
        navigate('/');
    };

    const handleItemSelect = (itemId) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const calculateTotal = () => {
        return cartItems
            .filter(item => selectedItems.has(item.id))
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const handleBulkPurchase = () => {
        const itemsToPurchase = cartItems.filter(item => selectedItems.has(item.id));
        if (itemsToPurchase.length === 0) {
            alert("Выберите товары для покупки");
            return;
        }

        navigate('/checkout', { 
            state: { 
                items: itemsToPurchase
            } 
        });
    };

    const getOrderStatusText = (status) => {
        switch (status) {
            case 0: return 'Ожидает оплаты';
            case 1: return 'В обработке';
            case 2: return 'Отправлен';
            case 3: return 'Доставлен';
            case 4: return 'Завершен';
            case 5: return 'Отменен';
            default: return 'Неизвестный статус';
        }
    };

    const getPaymentMethodText = (method) => {
        switch (method) {
            case "Cash": return 'Наличными при получении';
            case "Card": return 'Оплата картой онлайн';
            case "CardOnDelivery": return 'Оплата картой при получении';
            default: return 'Неизвестный метод оплаты';
        }
    };

    const getDeliveryMethodText = (method) => {
        switch (method) {
            case "Delivery": return 'Доставка';
            case "Pickup": return 'Самовывоз';
            default: return 'Неизвестный метод доставки';
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.API_URL}/auth/delete-account`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    navigate('/');
                } else {
                    const data = await response.json();
                    setError(data.message || 'Ошибка при удалении аккаунта');
                }
            } catch (err) {
                setError('Ошибка сервера. Пожалуйста, попробуйте позже.');
            }
        }
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!user) return <div className="error">Пользователь не найден</div>;

    const getDaysOnSite = () => {
        if (!user?.registeredAt) return 0;
        const registrationDate = new Date(user.registeredAt);
        const today = new Date();
        const diffTime = Math.abs(today - registrationDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Неизвестно';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return 'Неизвестно';
        }
    };

  return (
    <div className="profile-page">
            <div className="profile-header">
                <div className="profile-banner"></div>
                <div className="profile-content">
                    <div className="profile-left">
                        <div className="profile-info-container">
                            <div className="profile-avatar-container">
                                <img 
                                    src={user.avatarUrl || defaultAvatar} 
                                    alt="Аватар пользователя" 
                                    className="profile-avatar"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = defaultAvatar;
                                    }}
                                />
                            </div>
                            <div className="profile-info">
                                <h2 className="profile-name">{user.username}</h2>
                                <p className="profile-tag">@{user.username}</p>
                            </div>
                            <div className="profile-stats">
                                <div className="stat-box">
                                    <span className="stat-number">{getDaysOnSite()}</span>
                                    <span className="stat-label">ДНЕЙ НА САЙТЕ</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-number">{purchases.length}</span>
                                    <span className="stat-label">ПОКУПОК</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-number">{totalAmountDisplay}</span>
                                    <span className="stat-label">ОБЩАЯ СУММА</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-right">
                        <div className="profile-tabs">
                            <button 
                                className={`tab-button ${activeTab === 'purchases' ? 'active' : ''}`}
                                onClick={() => setActiveTab('purchases')}
                            >
                                <i className="fas fa-shopping-bag"></i>
                                Покупки
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'cart' ? 'active' : ''}`}
                                onClick={() => setActiveTab('cart')}
                            >
                                <i className="fas fa-shopping-cart"></i>
                                Корзина {cartItems.length > 0 && `(${cartItems.length})`}
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
                                onClick={() => setActiveTab('account')}
                            >
                                <i className="fas fa-user-cog"></i>
                                Данные
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTab === 'purchases' && (
                                <div className="purchases-history">
                                    {purchases.length === 0 ? (
                                        <div className="empty-message">У вас пока нет покупок</div>
                                    ) : (
                                        <div className="purchases-list">
                                            {purchases.map((purchase, index) => (
                                                <div key={index} className="purchase-card">
                                                    <div className="purchase-image">
                                                        <img 
                                                            src={purchase.imageUrl.startsWith('http') ? purchase.imageUrl : `https://gamefast-backend.onrender.com${purchase.imageUrl}`} 
                                                            alt={purchase.productName} 
                                                        />
                                                    </div>
                                                    <div className="purchase-info">
                                                        <h4>{purchase.productName}</h4>
                                                        <p className="purchase-price">
                                                            {purchase.priceDisplay}
                                                            {purchase.quantity > 1 && ` × ${purchase.quantity}`}
                                                        </p>
                                                        {purchase.productType === 'Subscription' && (
                                                            <p className="purchase-duration">
                                                                Длительность: {purchase.subscriptionDurationMonths} мес.
                                                            </p>
                                                        )}
                                                        <div className="purchase-details">
                                                            <p className="purchase-date">
                                                                Дата покупки: {new Date(purchase.purchaseDate).toLocaleDateString()}
                                                            </p>
                                                            <p className="purchase-payment">
                                                                Способ оплаты: {
                                                                    purchase.paymentMethod === "Cash" ? "Наличные" :
                                                                    purchase.paymentMethod === "Card" ? "Карта онлайн" :
                                                                    "Карта при получении"
                                                                }
                                                            </p>
                                                            <p className="purchase-delivery">
                                                                Способ получения: {
                                                                    purchase.deliveryMethod === "Delivery" ? (
                                                                        <>
                                                                            Доставка
                                                                            {purchase.deliveryAddress && (
                                                                                <span className="delivery-address">
                                                                                    <br />Адрес: {purchase.deliveryAddress}
                                                                                </span>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            Самовывоз
                                                                            {purchase.pickupPoint && (
                                                                                <span className="pickup-point">
                                                                                    <br />Пункт выдачи: {purchase.pickupPoint}
                                                                                </span>
                                                                            )}
                                                                        </>
                                                                    )
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'cart' && (
                                <>
                                    {error && <div className="error-message" style={{color: 'red', marginBottom: 16}}>{error}</div>}
                                    {cartItems.length === 0 ? (
                                        <div className="empty-message">Корзина пуста</div>
                                    ) : (
                                        <>
                                            <div className="cart-items">
                                                {cartItems.map((item) => (
                                                    <div key={item.id} className="cart-item">
                                                        <div className="item-select">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedItems.has(item.id)}
                                                                onChange={(e) => handleItemSelect(item.id, e.target.checked)}
                                                            />
                                                        </div>
                                                        <div className="item-content">
                                                            <div className="item-image">
                                                                <img src={item.imageUrl.startsWith('http') ? item.imageUrl : `https://gamefast-backend.onrender.com${item.imageUrl}`} alt={item.productName} />
                                                            </div>
                                                            <div className="item-details">
                                                                <h4>{item.productName}</h4>
                                                                <div className="price">{item.priceDisplay}</div>
                                                                {item.productType === 'Subscription' && (
                                                                    <div className="duration">
                                                                        Длительность: {item.subscriptionDuration} {
                                                                            item.subscriptionDuration === 1 ? 'месяц' :
                                                                            item.subscriptionDuration < 5 ? 'месяца' :
                                                                            'месяцев'
                                                                        }
                                                                    </div>
                                                                )}
                                                                {item.productType !== 'Subscription' && (
                                                                    <div className="quantity-controls">
                                                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                                                        <span>{item.quantity}</span>
                                                                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                                                                    </div>
                                                                )}
                                                                {quantityErrors[item.id] && (
                                                                    <div className="error-message" style={{color: 'red', marginTop: 8, fontSize: 14}}>{quantityErrors[item.id]}</div>
                                                                )}
                                                            </div>
                                                            <button
                                                                className="remove-button"
                                                                onClick={() => handleRemoveFromCart(item.id)}
                                                            >
                                                                Удалить
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {selectedItems.size > 0 && (
                                                <div className="cart-summary">
                                                    <p className="total">Итого: {calculateTotal().toFixed(2)} BYN</p>
                                                    <button 
                                                        className="purchase-button"
                                                        onClick={handleBulkPurchase}
                                                    >
                                                        Купить выбранные ({selectedItems.size})
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}

                            {activeTab === 'account' && (
                                <div className="account-section">
                                    <div className="account-info">
                                        <div className="avatar-wrapper">
                                            <div className="avatar-container">
                                                <img 
                                                    src={user.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `https://gamefast-backend.onrender.com${user.avatarUrl}`) : defaultAvatar} 
                                                    alt="Аватар пользователя" 
                                                    className="current-avatar"
                                                />
                                            </div>
                                            <button 
                                                className="change-avatar-button"
                                                onClick={() => fileInputRef.current.click()}
                                            >
                                                Изменить аватар
                                            </button>
                                            <input 
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleAvatarUpload}
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                        <div className="user-details">
                                            <div className="detail-item">
                                                <span className="detail-label">Email:</span>
                                                <span className="detail-value">{user.email}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Имя пользователя:</span>
                                                <span className="detail-value">{user.username}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Дата регистрации:</span>
                                                <span className="detail-value">{formatDate(user.registeredAt)}</span>
                                            </div>
                                        </div>
                                        <div className="account-actions">
                                            <button className="logout-button" onClick={handleLogout}>
                                                Выйти из аккаунта
                                            </button>
                                            <button className="delete-account-button" onClick={handleDeleteAccount}>
                                                Удалить аккаунт
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    </div>
  );
};

export default ProfilePage;