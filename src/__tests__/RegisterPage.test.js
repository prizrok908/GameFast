import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../components/RegisterPage';

describe('RegisterPage Component', () => {
  const renderRegisterPage = () => {
    return render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );
  };

  it('отображает основные элементы формы регистрации', () => {
    renderRegisterPage();
    
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('example@domain.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Минимум 3 символа')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Минимум 6 символов')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Повторите пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument();
    expect(screen.getByText('Уже есть аккаунт?')).toBeInTheDocument();
    expect(screen.getByText('Войти')).toBeInTheDocument();
  });
}); 