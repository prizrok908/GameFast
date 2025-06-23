import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  const renderApp = () => {
    return render(<App />);
  };

  it('отображает логотип', () => {
    renderApp();
    expect(screen.getByText('PS')).toBeInTheDocument();
  });

  it('отображает навигационные ссылки', () => {
    renderApp();
    expect(screen.getByText('Игры')).toBeInTheDocument();
    expect(screen.getByText('Консоли')).toBeInTheDocument();
    expect(screen.getByText('Аксессуары')).toBeInTheDocument();
    expect(screen.getByText('Подписки')).toBeInTheDocument();
  });

  it('отображает кнопку аккаунта', () => {
    renderApp();
    expect(screen.getByText('АККАУНТ')).toBeInTheDocument();
  });

  it('отображает поисковое поле', () => {
    renderApp();
    expect(screen.getByPlaceholderText('Поиск')).toBeInTheDocument();
  });

  it('отображает логотип в футере', () => {
    renderApp();
    const footerLogos = screen.getAllByText('Gamesfast');
    expect(footerLogos[1]).toBeInTheDocument(); // Берем второй элемент, так как первый - в hero секции
  });

  it('отображает ссылки в футере', () => {
    renderApp();
    expect(screen.getByText('Политика компании')).toBeInTheDocument();
    expect(screen.getByText('Поддержка')).toBeInTheDocument();
  });

  it('отображает копирайт', () => {
    renderApp();
    expect(screen.getByText('© 2024 Sony Interactive Entertainment Europe Limited (SIEE)')).toBeInTheDocument();
  });

  it('отображает социальные иконки', () => {
    renderApp();
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.some(link => link.href.includes('instagram.com'))).toBeTruthy();
  });
}); 