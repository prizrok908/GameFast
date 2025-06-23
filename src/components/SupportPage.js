import React from 'react';
import './SupportPage.css';

const SupportPage = () => {
  return (
    <div className="support-container">
      <h1>Поддержка</h1>

      <section className="support-section">
        <h2>Часто задаваемые вопросы</h2>
        
        <div className="faq-item">
          <h3>Как оформить заказ?</h3>
          <p>Выберите интересующие вас товары, добавьте их в корзину и следуйте инструкциям по оформлению заказа. При возникновении вопросов, наши специалисты готовы помочь вам.</p>
        </div>

        <div className="faq-item">
          <h3>Способы оплаты</h3>
          <p>Мы принимаем различные способы оплаты:</p>
          <ul>
            <li>Банковские карты (Visa, MasterCard)</li>
            <li>Электронные кошельки</li>
            <li>Наличные при получении</li>
            <li>Банковский перевод</li>
          </ul>
        </div>

        <div className="faq-item">
          <h3>Сроки доставки</h3>
          <p>Стандартная доставка осуществляется в течение 1-3 рабочих дней. Точные сроки зависят от вашего региона и выбранного способа доставки.</p>
        </div>
      </section>

      <section className="support-section">
        <h2>Контактная информация</h2>
        <div className="contact-info">
          <div className="contact-item">
            <h3>Разработчик:</h3>
            <p>Колотов Денис Павлович</p>
          </div>

          <div className="contact-item">
            <h3>Телефон поддержки:</h3>
            <p><a href="tel:+375444684029">+375 (44) 468-40-29</a></p>
            <p className="work-hours">Время работы: 9:00 - 21:00 (Пн-Вс)</p>
          </div>

          <div className="contact-item">
            <h3>Email:</h3>
            <p><a href="mailto:kolotovdenis508@gmail.com">kolotovdenis508@gmail.com</a></p>
            <p className="response-time">Среднее время ответа: 2 часа</p>
          </div>

          <div className="contact-item">
            <h3>Адрес офиса:</h3>
            <p>д. Тарасово, ул. Каштановая, 7</p>
            <p className="work-hours">Время работы: 10:00 - 22:00 (Пн-Вс)</p>
          </div>
        </div>
      </section>

      <section className="support-section">
        <h2>Техническая поддержка</h2>
        <p>Если у вас возникли технические проблемы с консолью или играми, наши специалисты готовы помочь вам. Мы предоставляем:</p>
        <ul>
          <li>Консультации по настройке оборудования</li>
          <li>Помощь с установкой игр и обновлений</li>
          <li>Решение проблем с подключением к сети</li>
          <li>Восстановление доступа к аккаунту</li>
        </ul>
      </section>
    </div>
  );
};

export default SupportPage; 