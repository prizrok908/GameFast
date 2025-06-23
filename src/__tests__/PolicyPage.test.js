import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PolicyPage from '../components/PolicyPage';

describe('PolicyPage Component', () => {
  const renderPolicyPage = () => {
    return render(
      <MemoryRouter>
        <PolicyPage />
      </MemoryRouter>
    );
  };

  it('отображает заголовок политики', () => {
    renderPolicyPage();
    expect(screen.getByText('Политика компании')).toBeInTheDocument();
  });

  it('отображает все разделы политики', () => {
    renderPolicyPage();
    expect(screen.getByText('1. Общие положения')).toBeInTheDocument();
    expect(screen.getByText('2. Конфиденциальность')).toBeInTheDocument();
    expect(screen.getByText('3. Условия возврата')).toBeInTheDocument();
    expect(screen.getByText('4. Доставка')).toBeInTheDocument();
    expect(screen.getByText('5. Гарантия')).toBeInTheDocument();
  });

  it('отображает контент раздела конфиденциальности', () => {
    renderPolicyPage();
    expect(screen.getByText('Мы защищаем ваши персональные данные и используем их только для улучшения качества обслуживания. Подробнее о том, как мы обрабатываем ваши данные:')).toBeInTheDocument();
    expect(screen.getByText('Сбор только необходимой информации')).toBeInTheDocument();
    expect(screen.getByText('Безопасное хранение данных')).toBeInTheDocument();
    expect(screen.getByText('Использование современных методов шифрования')).toBeInTheDocument();
    expect(screen.getByText('Неразглашение информации третьим лицам')).toBeInTheDocument();
  });

  it('отображает условия возврата', () => {
    renderPolicyPage();
    expect(screen.getByText('14 дней на возврат физических товаров')).toBeInTheDocument();
    expect(screen.getByText('Возврат средств за цифровой контент в течение 24 часов после покупки')).toBeInTheDocument();
    expect(screen.getByText('Полное возмещение при наличии заводского брака')).toBeInTheDocument();
  });

  it('отображает информацию о доставке', () => {
    renderPolicyPage();
    expect(screen.getByText('Бесплатная доставка при заказе от 200 BYN')).toBeInTheDocument();
    expect(screen.getByText('Доставка в течение 1-3 рабочих дней')).toBeInTheDocument();
    expect(screen.getByText('Возможность самовывоза из наших магазинов')).toBeInTheDocument();
  });

  it('отображает информацию о гарантии', () => {
    renderPolicyPage();
    expect(screen.getByText('2 года на консоли PlayStation')).toBeInTheDocument();
    expect(screen.getByText('1 год на аксессуары')).toBeInTheDocument();
    expect(screen.getByText('Бесплатное гарантийное обслуживание в авторизованных сервисных центрах')).toBeInTheDocument();
  });
}); 