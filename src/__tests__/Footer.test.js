import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  const renderFooter = () => {
    return render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
  };

  it('отображает логотип', () => {
    renderFooter();
    expect(screen.getByText('Gamesfast')).toBeInTheDocument();
  });

  it('отображает копирайт', () => {
    renderFooter();
    expect(screen.getByText('© 2024 Sony Interactive Entertainment Europe Limited (SIEE)')).toBeInTheDocument();
  });

  it('отображает навигационные ссылки', () => {
    renderFooter();
    expect(screen.getByText('Политика компании')).toBeInTheDocument();
    expect(screen.getByText('Поддержка')).toBeInTheDocument();
  });

  it('отображает социальные иконки', () => {
    renderFooter();
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.some(link => link.href.includes('instagram.com'))).toBeTruthy();
    expect(socialLinks.some(link => link.href.includes('linkedin.com'))).toBeTruthy();
    expect(socialLinks.some(link => link.href.includes('twitter.com'))).toBeTruthy();
    expect(socialLinks.some(link => link.href.includes('facebook.com'))).toBeTruthy();
  });
}); 