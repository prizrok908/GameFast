import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AllProducts from '../components/All Products';

// Мокаем fetch
global.fetch = jest.fn();

describe('AllProducts Component', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Test Product',
      imageUrl: 'test.jpg',
      price: 100,
      priceDisplay: '100 ₽',
      type: 'test',
      stockQuantity: 5
    }
  ];

  beforeEach(() => {
    // Очищаем мок перед каждым тестом
    fetch.mockClear();
    // Мокаем localStorage
    Storage.prototype.getItem = jest.fn();
  });

  it('отображает заголовок', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts)
      })
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <AllProducts />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Популярные товары')).toBeInTheDocument();
  });

  it('отображает сообщение загрузки', () => {
    fetch.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <AllProducts />
      </MemoryRouter>
    );

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('отображает сообщение об ошибке при неудачной загрузке', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Ошибка загрузки'))
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <AllProducts />
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/Ошибка:/)).toBeInTheDocument();
  });
}); 