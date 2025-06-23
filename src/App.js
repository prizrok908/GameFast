import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/Hero Section";
import AllProducts from "./components/All Products";
import Footer from "./components/Footer";
import GamesPage from "./components/GamesPage"; // Страница с играми
import AccessoriesPage from "./components/AccessoriesPage"; // Страница с аксессуарами
import SubscriptionsPage from "./components/SubscriptionsPage"; // Страница с подписками
import ConsolesPage from "./components/ConsolesPage"; // Страница с консолями
import ProfilePage from "./components/ProfilePage"; // Страница с профеля
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import PolicyPage from "./components/PolicyPage";
import SupportPage from "./components/SupportPage";
import CheckoutPage from "./components/CheckoutPage";
import AdminPanel from './components/AdminPanel';
import FAQPage from './components/FAQPage';
import "./App.css";

const App = () => {
  return (
    <Router>
      {/* Шапка */}
      <Header />

      {/* Основное содержимое */}
      <main>
        <Routes>
          {/* Главная страница */}
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <AllProducts />
              </>
            }
          />

          {/* Страницы */}
          <Route path="/games" element={<GamesPage />} />
          <Route path="/accessories" element={<AccessoriesPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/consoles" element={<ConsolesPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </main>

      {/* Подвал */}
      <Footer />
    </Router>
  );
};

export default App;