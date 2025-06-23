import { render, screen, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AllProducts from '../All Products';

// Мокаем fetch
global.fetch = jest.fn();

// Мокаем localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Мокаем window.location
delete window.location;
window.location = { reload: jest.fn() };

describe('AllProducts Component', () => {
  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    fetch.mockClear();
    localStorage.getItem.mockClear();
    window.location.reload.mockClear();
  });

  test('показывает сообщение загрузки при первоначальном рендере', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AllProducts />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  test('показывает товары после успешной загрузки', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Тестовый товар',
        imageUrl: 'test.jpg',
        price: 100,
        priceDisplay: '100 ₽',
        type: 'test',
        stockQuantity: 5
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <AllProducts />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Тестовый товар')).toBeInTheDocument();
  });

  test('показывает ошибку при неудачной загрузке', async () => {
    fetch.mockRejectedValueOnce(new Error('Ошибка загрузки'));

    await act(async () => {
      render(
        <BrowserRouter>
          <AllProducts />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Ошибка:/)).toBeInTheDocument();
    });
  });

  test('добавляет товар в корзину', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Тестовый товар',
        imageUrl: 'test.jpg',
        price: 100,
        priceDisplay: '100 ₽',
        type: 'test',
        stockQuantity: 5
      }
    ];

    localStorage.getItem.mockReturnValueOnce('test-token');

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      })
      .mockResolvedValueOnce({
        ok: true
      });

    await act(async () => {
      render(
        <BrowserRouter>
          <AllProducts />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
    });

    const buyButton = screen.getByText('Купить');
    await act(async () => {
      buyButton.click();
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/cart',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token'
        })
      })
    );
  });
}); 