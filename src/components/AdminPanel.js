import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './AdminPanel.css';
import config from '../config';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        type: 'Game',
        imageUrl: '',
        stockQuantity: ''
    });
    const [editProductId, setEditProductId] = useState(null);
    const [editProduct, setEditProduct] = useState({
        name: '',
        price: '',
        type: 'Game',
        imageUrl: '',
        stockQuantity: ''
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [productStats, setProductStats] = useState([]);
    const [paymentStats, setPaymentStats] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [orders, setOrders] = useState([]);
    const fileInputRef = useRef();
    const editFileInputRef = useRef();
    const navigate = useNavigate();

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

    const fetchProductStats = useCallback(async () => {
        try {
            const response = await fetch(`${config.API_URL}/statistics/purchases`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const stats = data.map(item => ({
                    name: item.productName,
                    value: item.totalQuantity
                })).slice(0, 10);
                setProductStats(stats);
            } else {
                setProductStats([]);
            }
        } catch (err) {
            setProductStats([]);
        }
    }, []);

    const fetchPaymentStats = useCallback(async () => {
        try {
            const response = await fetch(`${config.API_URL}/statistics/payments`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const stats = data.map(item => ({
                    name: getPaymentMethodText(item.paymentMethod),
                    value: item.count
                }));
                setPaymentStats(stats);
            } else {
                setPaymentStats([]);
            }
        } catch (err) {
            setPaymentStats([]);
        }
    }, []);

    const getPaymentMethodText = (method) => {
        if (method === null || method === undefined) return 'Неизвестно';
        switch (method.toString()) {
            case '0':
            case 'Cash':
                return 'Наличными';
            case '1':
            case 'Card':
                return 'Картой онлайн';
            case '2':
            case 'CardOnDelivery':
                return 'Картой при получении';
            default:
                return method.toString();
        }
    };

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch(`${config.API_URL}/products`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (err) {
            setError('Ошибка при загрузке товаров');
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch(`${config.API_URL}/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (err) {
            setError('Ошибка при загрузке пользователей');
        }
    }, []);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await fetch(`${config.API_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (err) {
            setOrders([]);
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'Admin') {
            navigate('/');
            return;
        }
        const loadStats = async () => {
            try {
                await Promise.all([
                    fetchProductStats(),
                    fetchPaymentStats(),
                    fetchProducts(),
                    fetchUsers(),
                    fetchOrders()
                ]);
                setIsDataLoaded(true);
            } catch (err) {
                setError('Ошибка при загрузке статистики');
            }
        };
        loadStats();
    }, [navigate, fetchProductStats, fetchPaymentStats, fetchProducts, fetchUsers, fetchOrders]);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const newProductData = {
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                type: newProduct.type,
                imageUrl: newProduct.imageUrl,
                stockQuantity: parseInt(newProduct.stockQuantity, 10)
            };
            const response = await fetch(`${config.API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newProductData)
            });
            if (response.ok) {
                fetchProducts();
                setNewProduct({
                    name: '',
                    price: '',
                    type: 'Game',
                    imageUrl: '',
                    stockQuantity: ''
                });
                setShowAddModal(false);
                setNotification({ type: 'success', message: 'Товар успешно добавлен!' });
                setTimeout(() => setNotification(null), 2000);
            } else {
                const errText = await response.text();
                setError('Ошибка при добавлении товара: ' + errText);
                setNotification({ type: 'error', message: 'Ошибка при добавлении товара' });
                setTimeout(() => setNotification(null), 2000);
            }
        } catch (err) {
            setError('Ошибка при добавлении товара: ' + err.message);
            setNotification({ type: 'error', message: 'Ошибка при добавлении товара' });
            setTimeout(() => setNotification(null), 2000);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
            try {
                const response = await fetch(`${config.API_URL}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.ok) {
                    fetchProducts();
                    setNotification({ type: 'success', message: 'Товар успешно удалён!' });
                    setTimeout(() => setNotification(null), 2000);
                } else {
                    const errText = await response.text();
                    setError('Ошибка при удалении товара: ' + errText);
                    setNotification({ type: 'error', message: 'Ошибка при удалении товара' });
                    setTimeout(() => setNotification(null), 2000);
                }
            } catch (err) {
                setError('Ошибка при удалении товара: ' + err.message);
                setNotification({ type: 'error', message: 'Ошибка при удалении товара' });
                setTimeout(() => setNotification(null), 2000);
            }
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            const response = await fetch(`${config.API_URL}/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newRole)
            });

            if (response.ok) {
                fetchUsers();
            }
        } catch (err) {
            setError('Ошибка при обновлении роли пользователя');
        }
    };

    const handleEditProductClick = (product) => {
        setEditProductId(product.id);
        setEditProduct({
            name: product.name,
            price: product.price,
            type: product.type,
            imageUrl: product.imageUrl,
            stockQuantity: product.stockQuantity
        });
        setShowEditModal(true);
    };

    const handleEditProductChange = (e) => {
        setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    };

    const handleEditProductSave = async (productId) => {
        try {
            const updatedProduct = {
                id: productId,
                name: editProduct.name,
                price: parseFloat(editProduct.price),
                type: editProduct.type,
                imageUrl: editProduct.imageUrl,
                stockQuantity: parseInt(editProduct.stockQuantity, 10)
            };
            const response = await fetch(`${config.API_URL}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedProduct)
            });
            if (response.ok) {
                fetchProducts();
                setEditProductId(null);
                setShowEditModal(false);
                setNotification({ type: 'success', message: 'Товар успешно обновлён!' });
                setTimeout(() => setNotification(null), 2000);
            } else {
                const errText = await response.text();
                setError('Ошибка при обновлении товара: ' + errText);
                setNotification({ type: 'error', message: 'Ошибка при обновлении товара' });
                setTimeout(() => setNotification(null), 2000);
            }
        } catch (err) {
            setError('Ошибка при обновлении товара: ' + err.message);
            setNotification({ type: 'error', message: 'Ошибка при обновлении товара' });
            setTimeout(() => setNotification(null), 2000);
        }
    };

    const handleEditProductCancel = () => {
        setEditProductId(null);
        setShowEditModal(false);
    };

    // Загрузка изображения для нового товара
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImagePreview(URL.createObjectURL(file));
        // Отправка на backend
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${config.API_URL}/Products/UploadImage`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData
        });
        if (response.ok) {
            const data = await response.json();
            setNewProduct({ ...newProduct, imageUrl: data.imageUrl });
        } else {
            setError('Ошибка при загрузке изображения');
        }
    };
    // Загрузка изображения для редактирования товара
    const handleEditImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setEditImagePreview(URL.createObjectURL(file));
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${config.API_URL}/Products/UploadImage`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData
        });
        if (response.ok) {
            const data = await response.json();
            setEditProduct({ ...editProduct, imageUrl: data.imageUrl });
        } else {
            setError('Ошибка при загрузке изображения');
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${config.API_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                fetchOrders();
            }
        } catch (err) {
            setError('Ошибка при обновлении статуса заказа');
        }
    };

    return (
        <div className="admin-panel">
            <h1>Панель администратора</h1>
            {error && <div className="error-message">{error}</div>}

            <div className="admin-tabs">
                <button 
                    className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Товары
                </button>
                <button 
                    className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Заказы
                </button>
                <button 
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Пользователи
                </button>
                <button 
                    className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                >
                    Статистика
                </button>
            </div>

            {activeTab === 'products' && (
                <section className="products-section">
                    <h2>Управление товарами</h2>
                    {notification && (
                        <div className={`notification ${notification.type}`}>{notification.message}</div>
                    )}
                    <button className="add-btn" style={{marginBottom: 20}} onClick={() => setShowAddModal(true)}>
                        Добавить товар
                    </button>
                    {showAddModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Добавить товар</h3>
                                <form onSubmit={handleAddProduct} className="add-product-form" style={{marginBottom: 0}}>
                                    <input
                                        type="text"
                                        placeholder="Название товара"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Цена"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                        required
                                        className="no-arrows"
                                    />
                                    <select
                                        value={newProduct.type}
                                        onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
                                        required
                                    >
                                        <option value="Game">Игра</option>
                                        <option value="Console">Консоль</option>
                                        <option value="Accessory">Аксессуар</option>
                                        <option value="Subscription">Подписка</option>
                                    </select>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{display: 'block'}}
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && <img src={imagePreview} alt="preview" style={{maxWidth: 120, margin: '0 auto', borderRadius: 8}} />}
                                    <input
                                        type="number"
                                        placeholder="Количество на складе"
                                        value={newProduct.stockQuantity}
                                        onChange={(e) => setNewProduct({...newProduct, stockQuantity: e.target.value})}
                                        required
                                        className="no-arrows"
                                    />
                                    <button type="submit" className="add-btn">Добавить</button>
                                    <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Отмена</button>
                                </form>
                            </div>
                        </div>
                    )}
                    <div className="products-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Тип</th>
                                    <th>Цена</th>
                                    <th>Количество</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} className={editProductId === product.id ? 'editing-row' : ''}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.type}</td>
                                        <td>{product.priceDisplay}</td>
                                        <td>{product.stockQuantity}</td>
                                        <td className="actions-cell">
                                            <button onClick={() => handleEditProductClick(product)} type="button" className="edit-btn hide-unless-hover">
                                                Редактировать
                                            </button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="delete-button hide-unless-hover" type="button">
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {showEditModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Редактировать товар</h3>
                                <form className="add-product-form" style={{marginBottom: 0}} onSubmit={e => { e.preventDefault(); handleEditProductSave(editProductId); }}>
                                    <input name="name" placeholder="Название товара" value={editProduct.name} onChange={handleEditProductChange} required />
                                    <select name="type" value={editProduct.type} onChange={handleEditProductChange} required>
                                        <option value="Game">Игра</option>
                                        <option value="Console">Консоль</option>
                                        <option value="Accessory">Аксессуар</option>
                                        <option value="Subscription">Подписка</option>
                                    </select>
                                    <input name="price" type="number" placeholder="Цена" value={editProduct.price} onChange={handleEditProductChange} className="no-arrows" required />
                                    <input name="stockQuantity" type="number" placeholder="Количество на складе" value={editProduct.stockQuantity} onChange={handleEditProductChange} className="no-arrows" required />
                                    <input type="file" accept="image/*" ref={editFileInputRef} style={{display: 'block'}} onChange={handleEditImageChange} />
                                    {(editImagePreview || editProduct.imageUrl) && <img src={editImagePreview || editProduct.imageUrl} alt="preview" style={{maxWidth: 120, margin: '0 auto', borderRadius: 8}} />}
                                    <button type="submit" className="add-btn">Сохранить</button>
                                    <button type="button" className="cancel-btn" onClick={handleEditProductCancel}>Отмена</button>
                                </form>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {activeTab === 'orders' && (
                <section className="orders-section">
                    <h2>Управление заказами</h2>
                    <div className="orders-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Пользователь</th>
                                    <th>Сумма</th>
                                    <th>Статус</th>
                                    <th>Дата</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.username}</td>
                                        <td>{order.priceDisplay}</td>
                                        <td>{order.status}</td>
                                        <td>{order.orderDate}</td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                            >
                                                <option value="Pending">В обработке</option>
                                                <option value="Processing">Обрабатывается</option>
                                                <option value="Shipped">Отправлен</option>
                                                <option value="Delivered">Доставлен</option>
                                                <option value="Completed">Завершён</option>
                                                <option value="Cancelled">Отменён</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {activeTab === 'users' && (
                <section className="users-section">
                    <h2>Управление пользователями</h2>
                    <div className="users-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Имя пользователя</th>
                                    <th>Email</th>
                                    <th>Роль</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                            >
                                                <option value="User">Пользователь</option>
                                                <option value="Admin">Администратор</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {activeTab === 'stats' && (
                <section className="stats-section">
                    <h2>Статистика продаж</h2>
                    <div className="stats-container">
                        <div className="stats-charts" style={{display: 'block', width: '100%'}}>
                            <div className="chart-card" style={{
                                width: '100%',
                                maxWidth: 950,
                                margin: '0 auto 64px auto',
                                background: '#fafbfc',
                                borderRadius: 18,
                                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                                padding: '36px 32px 32px 32px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                boxSizing: 'border-box'
                            }}>
                                <h3 style={{marginBottom: 24}}>Популярные товары</h3>
                                <div className="chart-container" style={{height: 300, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 32}}>
                                    <ResponsiveContainer width={420} height={320}>
                                        <PieChart>
                                            <Pie
                                                data={productStats}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={90}
                                                fill="#8884d8"
                                            >
                                                {productStats.map((entry, index) => (
                                                    <Cell key={`cell-product-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={({active, payload}) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div style={{background: '#fff', border: '1px solid #ccc', padding: 12, fontSize: 18, borderRadius: 8}}>
                                                            <b>{payload[0].name}</b>: {payload[0].value} шт.
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }} />
                                            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize: 16, marginTop: 48}}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {productStats.length > 0 && (
                                    <div style={{
                                        marginTop: 48,
                                        maxWidth: 520,
                                        width: '100%',
                                        background: '#fff',
                                        borderRadius: 12,
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                                        padding: 20,
                                        alignSelf: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        boxSizing: 'border-box'
                                    }}>
                                        <h4 style={{fontSize: 18, marginBottom: 10}}>Доля продаж по товарам</h4>
                                        <div style={{overflowX: 'auto', width: '100%'}}>
                                            <table style={{width: '100%', fontSize: 16, borderCollapse: 'collapse'}}>
                                                <thead>
                                                    <tr>
                                                        <th style={{textAlign: 'left', padding: 6}}>Товар</th>
                                                        <th style={{textAlign: 'right', padding: 6}}>Кол-во</th>
                                                        <th style={{textAlign: 'right', padding: 6}}>Доля</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {productStats.map((entry, idx) => {
                                                        const total = productStats.reduce((sum, e) => sum + e.value, 0);
                                                        const percent = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
                                                        return (
                                                            <tr key={entry.name}>
                                                                <td style={{padding: 6}}>{entry.name}</td>
                                                                <td style={{textAlign: 'right', padding: 6}}>{entry.value}</td>
                                                                <td style={{textAlign: 'right', padding: 6}}>{percent}%</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="chart-card" style={{
                                width: '100%',
                                maxWidth: 950,
                                margin: '0 auto 64px auto',
                                background: '#fafbfc',
                                borderRadius: 18,
                                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                                padding: '36px 32px 32px 32px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                boxSizing: 'border-box'
                            }}>
                                <h3 style={{marginBottom: 24}}>Способы оплаты</h3>
                                <div className="chart-container" style={{height: 300, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 32}}>
                                    <ResponsiveContainer width={420} height={320}>
                                        <PieChart>
                                            <Pie
                                                data={paymentStats}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={90}
                                                fill="#8884d8"
                                            >
                                                {paymentStats.map((entry, index) => (
                                                    <Cell key={`cell-payment-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={({active, payload}) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div style={{background: '#fff', border: '1px solid #ccc', padding: 12, fontSize: 18, borderRadius: 8}}>
                                                            <b>{payload[0].name}</b>: {payload[0].value} заказ(ов)
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }} />
                                            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize: 16, marginTop: 48}}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {paymentStats.length > 0 && (
                                    <div style={{
                                        marginTop: 48,
                                        maxWidth: 520,
                                        width: '100%',
                                        background: '#fff',
                                        borderRadius: 12,
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                                        padding: 20,
                                        alignSelf: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        boxSizing: 'border-box'
                                    }}>
                                        <h4 style={{fontSize: 18, marginBottom: 10}}>Доля по способам оплаты</h4>
                                        <div style={{overflowX: 'auto', width: '100%'}}>
                                            <table style={{width: '100%', fontSize: 16, borderCollapse: 'collapse'}}>
                                                <thead>
                                                    <tr>
                                                        <th style={{textAlign: 'left', padding: 6}}>Способ</th>
                                                        <th style={{textAlign: 'right', padding: 6}}>Кол-во</th>
                                                        <th style={{textAlign: 'right', padding: 6}}>Доля</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paymentStats.map((entry, idx) => {
                                                        const total = paymentStats.reduce((sum, e) => sum + e.value, 0);
                                                        const percent = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
                                                        return (
                                                            <tr key={entry.name}>
                                                                <td style={{padding: 6}}>{entry.name}</td>
                                                                <td style={{textAlign: 'right', padding: 6}}>{entry.value}</td>
                                                                <td style={{textAlign: 'right', padding: 6}}>{percent}%</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default AdminPanel; 