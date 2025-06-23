import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Очищаем ошибку при изменении полей
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Валидация email
        if (!validateEmail(formData.email)) {
            setError('Пожалуйста, введите корректный email адрес');
            return;
        }

        // Валидация пароля
        if (!formData.password) {
            setError('Пожалуйста, введите пароль');
            return;
        }

        if (formData.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Attempting to login with:', { email: formData.email });
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Server response:', { status: response.status, ok: response.ok });

            if (response.ok) {
                console.log('Login successful, storing token and user data');
                // Сохраняем токен и данные пользователя
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Оповещаем другие компоненты об изменении localStorage
                window.dispatchEvent(new Event('localStorageChange'));
                
                // Перенаправляем на главную страницу
                navigate('/');
            } else {
                // Проверяем, есть ли сообщение об ошибке в ответе
                console.error('Login failed:', data);
                setError(data.message || 'Неверный email или пароль');
            }
        } catch (err) {
            console.error('Error during login:', err);
            if (!navigator.onLine) {
                setError('Отсутствует подключение к интернету. Проверьте подключение и попробуйте снова.');
            } else {
                setError('Ошибка сервера. Пожалуйста, попробуйте позже.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Вход</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            placeholder="example@domain.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Пароль:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                <div className="register-link">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 