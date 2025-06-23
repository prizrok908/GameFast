import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HeroSection from '../components/Hero Section';

describe('HeroSection Component', () => {
  const renderHeroSection = () => {
    return render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>
    );
  };

  it('отображает заголовок', () => {
    renderHeroSection();
    expect(screen.getByText('Gamesfast')).toBeInTheDocument();
  });

  it('отображает описание', () => {
    renderHeroSection();
    expect(screen.getByText('Покупка никогда не была такой простой и быстрой')).toBeInTheDocument();
  });

  it('отображает метрики', () => {
    renderHeroSection();
    expect(screen.getByText('430K+ Нас выбирают')).toBeInTheDocument();
    expect(screen.getByText('159K+ Игры')).toBeInTheDocument();
    expect(screen.getByText('87 Сотрудники')).toBeInTheDocument();
  });

  it('отображает метку новинок', () => {
    renderHeroSection();
    expect(screen.getByText('НОВИНКИ')).toBeInTheDocument();
  });

  it('отображает кнопки навигации', () => {
    renderHeroSection();
    const upButton = screen.getByText('↑');
    const downButton = screen.getByText('↓');
    expect(upButton).toBeInTheDocument();
    expect(downButton).toBeInTheDocument();
  });

  it('отображает изображение игры', () => {
    renderHeroSection();
    const gameImage = screen.getByAltText('Game');
    expect(gameImage).toBeInTheDocument();
    expect(gameImage.src).toContain('/images/1.jpg');
  });

  it('меняет изображение при нажатии на кнопки навигации', () => {
    renderHeroSection();
    const gameImage = screen.getByAltText('Game');
    const downButton = screen.getByText('↓');
    
    // Начальное изображение
    expect(gameImage.src).toContain('/images/1.jpg');
    
    // Нажимаем кнопку вниз
    fireEvent.click(downButton);
    expect(gameImage.src).toContain('/images/2.jpg');
    
    // Нажимаем еще раз
    fireEvent.click(downButton);
    expect(gameImage.src).toContain('/images/1.jpg');
  });

  test('renders call to action buttons', () => {
    renderHeroSection();
    expect(screen.getByText('Начать покупки')).toBeInTheDocument();
    expect(screen.getByText('Узнать больше')).toBeInTheDocument();
  });

  test('navigates to products page on shop now click', () => {
    renderHeroSection();
    const shopNowButton = screen.getByText('Начать покупки');
    fireEvent.click(shopNowButton);
    expect(window.location.pathname).toBe('/products');
  });

  test('navigates to about page on learn more click', () => {
    renderHeroSection();
    const learnMoreButton = screen.getByText('Узнать больше');
    fireEvent.click(learnMoreButton);
    expect(window.location.pathname).toBe('/about');
  });

  test('renders featured content', () => {
    renderHeroSection();
    
    expect(screen.getByText(/Featured Games/i)).toBeInTheDocument();
    expect(screen.getByText(/New Releases/i)).toBeInTheDocument();
  });

  test('displays promotional content', () => {
    renderHeroSection();
    
    expect(screen.getByText(/Special Offers/i)).toBeInTheDocument();
    expect(screen.getByText(/Limited Time Deals/i)).toBeInTheDocument();
  });
}); 