import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';
import config from '../config';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
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

        // Валидация имени пользователя
        if (!formData.username) {
            setError('Пожалуйста, введите имя пользователя');
            return;
        }

        if (formData.username.length < 3) {
            setError('Имя пользователя должно содержать минимум 3 символа');
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

        // Проверяем совпадение паролей
        if (!formData.confirmPassword) {
            setError('Пожалуйста, подтвердите пароль');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Attempting to register with:', { email: formData.email, username: formData.username });
            const response = await fetch(`${config.API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();
            console.log('Server response:', { status: response.status, ok: response.ok });

            if (response.ok) {
                console.log('Registration successful, storing token and user data');
                // Сохраняем токен и данные пользователя
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Оповещаем другие компоненты об изменении localStorage
                window.dispatchEvent(new Event('localStorageChange'));
                
                // Перенаправляем на главную страницу
                navigate('/');
            } else {
                // Проверяем, есть ли сообщение об ошибке в ответе
                console.error('Registration failed:', data);
                setError(data.message || 'Ошибка при регистрации');
            }
        } catch (err) {
            console.error('Error during registration:', err);
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
        <div className="register-container">
            <div className="register-form">
                <h2>Регистрация</h2>
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
                        <label>Имя пользователя:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            minLength={3}
                            placeholder="Минимум 3 символа"
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
                            minLength={6}
                            disabled={isLoading}
                            placeholder="Минимум 6 символов"
                        />
                    </div>
                    <div className="form-group">
                        <label>Подтвердите пароль:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                            disabled={isLoading}
                            placeholder="Повторите пароль"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="register-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                <div className="login-link">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage; 