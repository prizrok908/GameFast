import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CheckoutPage.css';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.vfs;

// Функция для транслитерации русского текста в латиницу (упрощённо)
function translit(str) {
    const ru = {'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'E','Ж':'ZH','З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'KH','Ц':'TS','Ч':'CH','Ш':'SH','Щ':'SCH','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'YU','Я':'YA','а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
    return str.split('').map(l => ru[l] || l).join('');
}

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [formData, setFormData] = useState({
        paymentMethod: 0, // 0 = Cash, 1 = Card, 2 = CardOnDelivery
        deliveryMethod: 0, // 0 = Delivery, 1 = Pickup
        city: '',
        street: '',
        house: '',
        apartment: '',
        intercom: '',
        pickupPoint: 'Минск, ул. Притыцкого 156',
        phoneNumber: '',
        comment: '',
        // Поля для карты
        cardNumber: '',
        cardExpiryMonth: '01',
        cardExpiryYear: new Date().getFullYear().toString().slice(-2),
        cardCVV: '',
        cardHolder: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);

    // Список пунктов выдачи
    const pickupPoints = [
        'Минск, ул. Притыцкого 156',
        'Минск, пр. Независимости 164',
        'Минск, ул. Кульман 14',
        'Минск, ул. Сурганова 57Б'
    ];

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        const userData = JSON.parse(userStr);
        setUser(userData);

        // Получаем данные о товарах из location state
        if (location.state?.items) {
            setItems(location.state.items);
            const total = location.state.items.reduce((sum, item) => 
                sum + item.price * item.quantity, 0);
            setTotalAmount(total);
        } else {
            navigate('/profile');
        }
    }, [navigate, location]);

    const formatPhoneNumber = (value) => {
        // Удаляем все нецифровые символы
        const cleaned = value.replace(/\D/g, '');
        
        // Форматируем номер телефона
        if (cleaned.length === 0) return '';
        if (cleaned.length <= 2) return `+${cleaned}`;
        if (cleaned.length <= 4) return `+${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
        if (cleaned.length <= 7) return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
        if (cleaned.length <= 9) return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}${cleaned.length > 10 ? `-${cleaned.slice(10, 12)}` : ''}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Преобразуем значение в число для paymentMethod и deliveryMethod
        if (name === 'paymentMethod' || name === 'deliveryMethod') {
            setFormData(prev => ({
                ...prev,
                [name]: parseInt(value, 10)
            }));
            return;
        }

        // Специальная обработка для номера телефона
        if (name === 'phoneNumber') {
            setFormData(prev => ({
                ...prev,
                [name]: formatPhoneNumber(value)
            }));
            return;
        }

        // Специальная обработка для номера карты
        if (name === 'cardNumber') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length <= 16) {
                const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
                setFormData(prev => ({
                    ...prev,
                    [name]: formatted
                }));
            }
            return;
        }

        // Специальная обработка для CVV
        if (name === 'cardCVV') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length <= 3) {
                setFormData(prev => ({
                    ...prev,
                    [name]: cleaned
                }));
            }
            return;
        }

        // Специальная обработка для номера домофона
        if (name === 'intercom') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length <= 3) {
                setFormData(prev => ({
                    ...prev,
                    [name]: cleaned
                }));
            }
            return;
        }

        // Обработка остальных полей
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Генерация опций для месяцев
    const monthOptions = Array.from({ length: 12 }, (_, i) => {
        const month = (i + 1).toString().padStart(2, '0');
        return (
            <option key={month} value={month}>
                {month}
            </option>
        );
    });

    // Генерация опций для годов (текущий год + 10 лет)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 11 }, (_, i) => {
        const year = currentYear + i;
        return (
            <option key={year} value={year.toString().slice(-2)}>
                {year}
            </option>
        );
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Валидация полей карты при онлайн оплате
        if (formData.paymentMethod === 1) {
            if (!formData.cardNumber || !formData.cardExpiryMonth || !formData.cardExpiryYear || !formData.cardCVV || !formData.cardHolder) {
                setError('Пожалуйста, заполните все поля карты');
                setLoading(false);
                return;
            }
        }

        // Валидация обязательных полей доставки
        if (formData.deliveryMethod === 0) {
            if (!formData.city || !formData.street || !formData.house) {
                setError('Пожалуйста, заполните обязательные поля адреса');
                setLoading(false);
                return;
            }
        }

        try {
            const response = await fetch('http://localhost:5000/api/cart/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    paymentMethod: formData.paymentMethod.toString(),
                    deliveryMethod: formData.deliveryMethod.toString(),
                    deliveryAddress: formData.deliveryMethod === 0 
                        ? `${formData.city}, ${formData.street}, д. ${formData.house}${formData.apartment ? `, кв. ${formData.apartment}` : ''}${formData.intercom ? `, домофон: ${formData.intercom}` : ''}`
                        : null,
                    pickupPoint: formData.deliveryMethod === 1 ? formData.pickupPoint : null,
                    phoneNumber: formData.phoneNumber,
                    comment: formData.comment,
                    selectedItems: items.map(item => item.id)
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData);
            }

            const data = await response.json();
            
            // Показываем чек
            setReceiptData({
                orderId: data.orderId || Math.floor(Math.random()*1000000),
                date: new Date().toLocaleString(),
                items,
                totalAmount,
                delivery: formData.deliveryMethod === 0
                    ? `${formData.city}, ${formData.street}, д. ${formData.house}${formData.apartment ? `, кв. ${formData.apartment}` : ''}${formData.intercom ? `, домофон: ${formData.intercom}` : ''}`
                    : formData.pickupPoint,
                isDelivery: formData.deliveryMethod === 0,
                payment: ['Наличными', 'Картой онлайн', 'Картой при получении'][formData.paymentMethod],
                phone: formData.phoneNumber,
                comment: formData.comment
            });
            setShowReceipt(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Модальное окно чека
    const handleDownloadPDF = () => {
        if (!receiptData) return;
        const docDefinition = {
            content: [
                { text: 'ЧЕК ЗАКАЗА', style: 'header', alignment: 'center', margin: [0,0,0,12] },
                {
                    columns: [
                        [
                            { text: `Номер заказа:`, bold: true, width: 'auto' },
                            { text: `Дата:`, bold: true, width: 'auto' },
                            { text: `Телефон:`, bold: true, width: 'auto' },
                            receiptData.isDelivery
                                ? { text: `Доставка:`, bold: true, width: 'auto' }
                                : { text: `Самовывоз:`, bold: true, width: 'auto' },
                            { text: `Оплата:`, bold: true, width: 'auto' },
                            receiptData.comment ? { text: `Комментарий:`, bold: true, width: 'auto' } : null
                        ].filter(Boolean),
                        [
                            { text: `${receiptData.orderId}` },
                            { text: `${receiptData.date}` },
                            { text: `${receiptData.phone}` },
                            { text: `${receiptData.delivery}` },
                            { text: `${receiptData.payment}` },
                            receiptData.comment ? { text: `${receiptData.comment}` } : null
                        ].filter(Boolean)
                    ],
                    columnGap: 16,
                    margin: [0,0,0,18],
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 50, 70],
                        body: [
                            [
                                { text: 'Товар', style: 'tableHeader', fillColor: '#f2f2f2', color: '#111', alignment: 'center' },
                                { text: 'Кол-во', style: 'tableHeader', fillColor: '#f2f2f2', color: '#111', alignment: 'center' },
                                { text: 'Цена', style: 'tableHeader', fillColor: '#f2f2f2', color: '#111', alignment: 'center' }
                            ],
                            ...receiptData.items.map(item => [
                                { text: item.productName, alignment: 'left', margin: [0,2,0,2] },
                                { text: String(item.quantity), alignment: 'center' },
                                { text: item.priceDisplay, alignment: 'right' }
                            ])
                        ]
                    },
                    layout: {
                        fillColor: (rowIndex) => rowIndex === 0 ? null : rowIndex % 2 === 0 ? '#fafafa' : null,
                        hLineWidth: () => 0.5,
                        vLineWidth: () => 0.5,
                        hLineColor: () => '#bbb',
                        vLineColor: () => '#bbb',
                        paddingLeft: () => 8,
                        paddingRight: () => 8,
                        paddingTop: () => 4,
                        paddingBottom: () => 4
                    },
                    margin: [0,0,0,18]
                },
                { text: `Итого: ${receiptData.totalAmount.toFixed(2)} BYN`, style: 'total', alignment: 'right', margin: [0,0,0,18] },
                { text: 'Спасибо за покупку в нашем магазине!', style: 'footer', alignment: 'center', color: '#444', margin: [0,24,0,0] }
            ],
            styles: {
                header: { fontSize: 22, bold: true, margin: [0, 0, 0, 8] },
                tableHeader: { fontSize: 14, bold: true },
                total: { fontSize: 16, bold: true },
                footer: { fontSize: 12, italics: true }
            },
            defaultStyle: {
                font: 'Roboto'
            }
        };
        // Формируем имя файла на русском
        let fileName = '';
        if (receiptData.orderId) {
            fileName = `Чек-заказа-${receiptData.orderId}.pdf`;
        } else {
            // Если нет orderId, используем дату
            const dateStr = (receiptData.date || new Date().toLocaleDateString()).replace(/\D+/g, '-');
            fileName = `Чек-заказа-${dateStr}.pdf`;
        }
        pdfMake.createPdf(docDefinition).download(fileName);
    };
    const handleCloseReceipt = () => {
        setShowReceipt(false);
        navigate('/profile', { state: { orderSuccess: true, message: 'Заказ успешно оформлен!' } });
    };

    if (!user || !items.length) return <div>Загрузка...</div>;

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <h2>Оформление заказа</h2>
                {error && <div className="error-message">{error}</div>}
                
                <div className="order-summary">
                    <h3>Ваш заказ</h3>
                    <div className="order-items">
                        {items.map((item, index) => (
                            <div key={index} className="order-item">
                                <img 
                                    src={`http://localhost:5000${item.imageUrl}`} 
                                    alt={item.productName} 
                                />
                                <div className="item-details">
                                    <h4>{item.productName}</h4>
                                    <p>
                                        {item.priceDisplay}
                                        {item.quantity > 1 && ` × ${item.quantity}`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="order-total">
                        <span>Итого:</span>
                        <span>{totalAmount.toFixed(2)} BYN</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="form-section">
                        <h3>Способ оплаты</h3>
                        <div className="payment-methods">
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={0}
                                    checked={formData.paymentMethod === 0}
                                    onChange={handleInputChange}
                                />
                                Наличными при получении
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={1}
                                    checked={formData.paymentMethod === 1}
                                    onChange={handleInputChange}
                                />
                                Картой онлайн
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={2}
                                    checked={formData.paymentMethod === 2}
                                    onChange={handleInputChange}
                                />
                                Картой при получении
                            </label>

                            {formData.paymentMethod === 1 && (
                                <div className="card-fields">
                                    <div className="form-group">
                                        <label>Номер карты:</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            placeholder="1234 5678 9012 3456"
                                        />
                                    </div>
                                    <div className="form-group expiry-date">
                                        <label>Срок действия:</label>
                                        <div className="expiry-selects">
                                            <select
                                                name="cardExpiryMonth"
                                                value={formData.cardExpiryMonth}
                                                onChange={handleInputChange}
                                                className="month-select"
                                            >
                                                {monthOptions}
                                            </select>
                                            <span>/</span>
                                            <select
                                                name="cardExpiryYear"
                                                value={formData.cardExpiryYear}
                                                onChange={handleInputChange}
                                                className="year-select"
                                            >
                                                {yearOptions}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>CVV:</label>
                                        <input
                                            type="text"
                                            name="cardCVV"
                                            value={formData.cardCVV}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Имя держателя карты:</label>
                                        <input
                                            type="text"
                                            name="cardHolder"
                                            value={formData.cardHolder}
                                            onChange={handleInputChange}
                                            placeholder="IVAN IVANOV"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Способ получения</h3>
                        <div className="delivery-methods">
                            <label>
                                <input
                                    type="radio"
                                    name="deliveryMethod"
                                    value={0}
                                    checked={formData.deliveryMethod === 0}
                                    onChange={handleInputChange}
                                />
                                Доставка
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="deliveryMethod"
                                    value={1}
                                    checked={formData.deliveryMethod === 1}
                                    onChange={handleInputChange}
                                />
                                Самовывоз
                            </label>
                        </div>

                        {formData.deliveryMethod === 1 && (
                            <div className="pickup-points">
                                {pickupPoints.map((point, index) => (
                                    <label key={index} className={`pickup-point-option ${formData.pickupPoint === point ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="pickupPoint"
                                            value={point}
                                            checked={formData.pickupPoint === point}
                                            onChange={handleInputChange}
                                        />
                                        {point}
                                    </label>
                                ))}
                            </div>
                        )}

                        {formData.deliveryMethod === 0 && (
                            <div className="address-fields">
                                <div className="form-group">
                                    <label>Город:</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Минск"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Улица:</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        placeholder="Независимости"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Дом:</label>
                                    <input
                                        type="text"
                                        name="house"
                                        value={formData.house}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Квартира:</label>
                                    <input
                                        type="text"
                                        name="apartment"
                                        value={formData.apartment}
                                        onChange={handleInputChange}
                                        placeholder="42"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Домофон:</label>
                                    <input
                                        type="text"
                                        name="intercom"
                                        value={formData.intercom}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Телефон:</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="+375 XX XXX-XX-XX"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Комментарий к заказу:</label>
                            <textarea
                                name="comment"
                                value={formData.comment}
                                onChange={handleInputChange}
                                placeholder="Дополнительная информация к заказу"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Оформление...' : 'Оформить заказ'}
                    </button>
                </form>
            </div>
            {showReceipt && receiptData && (
                <div className="modal-overlay" style={{zIndex: 9999}}>
                    <div className="modal-content" style={{maxWidth: 420, padding: 24, textAlign: 'center'}}>
                        <h2>Чек заказа</h2>
                        <div style={{textAlign: 'left', margin: '0 auto 16px', fontSize: 16}}>
                            <div><b>Номер заказа:</b> {receiptData.orderId}</div>
                            <div><b>Дата:</b> {receiptData.date}</div>
                            <div><b>Телефон:</b> {receiptData.phone}</div>
                            {receiptData.isDelivery
                              ? <div><b>Доставка:</b> {receiptData.delivery}</div>
                              : <div><b>Самовывоз:</b> {receiptData.delivery}</div>}
                            <div><b>Оплата:</b> {receiptData.payment}</div>
                            {receiptData.comment && <div><b>Комментарий:</b> {receiptData.comment}</div>}
                            <hr style={{margin: '12px 0'}}/>
                            <b>Товары:</b>
                            <ul style={{paddingLeft: 18}}>
                                {receiptData.items.map((item, idx) => (
                                    <li key={idx}>{item.productName} × {item.quantity} — {item.priceDisplay}</li>
                                ))}
                            </ul>
                            <div style={{marginTop: 12, fontWeight: 700}}>Итого: {receiptData.totalAmount.toFixed(2)} BYN</div>
                        </div>
                        <button className="add-btn" onClick={handleDownloadPDF} style={{marginBottom: 10}}>Скачать PDF</button>
                        <button className="close-btn" onClick={handleCloseReceipt}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage; 