import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../components/LoginPage';

describe('LoginPage Component', () => {
  const renderLoginPage = () => {
    return render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  };

  it('отображает форму входа', () => {
    renderLoginPage();
    
    // Проверяем наличие основных элементов формы
    expect(screen.getByText('Вход')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('example@domain.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });

  it('показывает ошибки валидации для пустых полей', () => {
    renderLoginPage();
    
    // Нажимаем кнопку входа без заполнения полей
    const loginButton = screen.getByRole('button', { name: 'Войти' });
    fireEvent.click(loginButton);
    
    // Проверяем наличие сообщения об ошибке для email
    expect(screen.getByText('Пожалуйста, введите корректный email адрес')).toBeInTheDocument();
  });

  it('показывает ошибку валидации для некорректного email', () => {
    renderLoginPage();
    
    // Вводим некорректный email
    const emailInput = screen.getByPlaceholderText('example@domain.com');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Нажимаем кнопку входа
    const loginButton = screen.getByRole('button', { name: 'Войти' });
    fireEvent.click(loginButton);
    
    // Проверяем наличие сообщения об ошибке
    expect(screen.getByText('Пожалуйста, введите корректный email адрес')).toBeInTheDocument();
  });

  it('показывает ссылку на регистрацию', () => {
    renderLoginPage();
    expect(screen.getByText('Нет аккаунта?')).toBeInTheDocument();
    expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument();
  });
}); 