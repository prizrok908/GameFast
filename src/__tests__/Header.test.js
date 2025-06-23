import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';

describe('Header Component', () => {
  const renderHeader = () => {
    return render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  };

  it('отображает навигационные ссылки', () => {
    renderHeader();
    expect(screen.getByText('Игры')).toBeInTheDocument();
    expect(screen.getByText('Консоли')).toBeInTheDocument();
    expect(screen.getByText('Аксессуары')).toBeInTheDocument();
    expect(screen.getByText('Подписки')).toBeInTheDocument();
  });

  it('отображает логотип', () => {
    renderHeader();
    expect(screen.getByText('PS')).toBeInTheDocument();
  });

  it('отображает поле поиска', () => {
    renderHeader();
    expect(screen.getByPlaceholderText('Поиск')).toBeInTheDocument();
  });
}); 