import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SupportPage from '../components/SupportPage';

describe('SupportPage Component', () => {
  const renderSupportPage = () => {
    return render(
      <MemoryRouter>
        <SupportPage />
      </MemoryRouter>
    );
  };

  it('отображает заголовок страницы', () => {
    renderSupportPage();
    expect(screen.getByText('Поддержка')).toBeInTheDocument();
  });

  it('отображает раздел FAQ', () => {
    renderSupportPage();
    expect(screen.getByText('Часто задаваемые вопросы')).toBeInTheDocument();
    expect(screen.getByText('Как оформить заказ?')).toBeInTheDocument();
    expect(screen.getByText('Способы оплаты')).toBeInTheDocument();
    expect(screen.getByText('Сроки доставки')).toBeInTheDocument();
  });

  it('отображает контактную информацию', () => {
    renderSupportPage();
    expect(screen.getByText('Контактная информация')).toBeInTheDocument();
    expect(screen.getByText('Разработчик:')).toBeInTheDocument();
    expect(screen.getByText('Колотов Денис Павлович')).toBeInTheDocument();
    expect(screen.getByText('Телефон поддержки:')).toBeInTheDocument();
    expect(screen.getByText('+375 (44) 468-40-29')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('kolotovdenis508@gmail.com')).toBeInTheDocument();
  });

  it('отображает раздел технической поддержки', () => {
    renderSupportPage();
    expect(screen.getByText('Техническая поддержка')).toBeInTheDocument();
    expect(screen.getByText(/Если у вас возникли технические проблемы/)).toBeInTheDocument();
    expect(screen.getByText('Консультации по настройке оборудования')).toBeInTheDocument();
    expect(screen.getByText('Помощь с установкой игр и обновлений')).toBeInTheDocument();
    expect(screen.getByText('Решение проблем с подключением к сети')).toBeInTheDocument();
    expect(screen.getByText('Восстановление доступа к аккаунту')).toBeInTheDocument();
  });
}); 