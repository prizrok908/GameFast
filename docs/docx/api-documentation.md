# API документация GameFast

## Обзор

API GameFast предоставляет доступ к функциональности интернет-магазина игровых консолей, игр и аксессуаров. API построено по принципам REST и использует JSON для форматирования данных.

## Базовая информация

- **Базовый URL**: `https://api.gamefast.com/v1` (для продакшн-окружения)
- **Локальный URL**: `http://localhost:5000/api` (для разработки)
- **Формат данных**: JSON
- **Кодировка**: UTF-8

## Аутентификация

API GameFast использует JWT (JSON Web Tokens) для аутентификации. Все запросы к защищенным эндпоинтам должны содержать заголовок авторизации:

```
Authorization: Bearer {token}
```

Где `{token}` - это JWT-токен, полученный при авторизации.

### Получение токена

#### Регистрация нового пользователя

**Endpoint**: `POST /auth/register`

**Описание**: Регистрирует нового пользователя в системе и возвращает JWT-токен.

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

**Response** (200 OK):
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "token": "string",
  "role": "string"
}
```

**Response** (400 Bad Request):
```json
{
  "error": "string",
  "details": {
    "field": "error message"
  }
}
```

#### Авторизация пользователя

**Endpoint**: `POST /auth/login`

**Описание**: Аутентифицирует пользователя и возвращает JWT-токен.

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "token": "string",
  "role": "string"
}
```

**Response** (401 Unauthorized):
```json
{
  "error": "Invalid credentials"
}
```

#### Выход из системы

**Endpoint**: `POST /auth/logout`

**Описание**: Завершает сессию пользователя (добавляет токен в черный список).

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "message": "Successfully logged out"
}
```

#### Получение информации о текущем пользователе

**Endpoint**: `GET /auth/user`

**Описание**: Возвращает информацию о текущем авторизованном пользователе.

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "string",
  "registrationDate": "datetime"
}
```

**Response** (401 Unauthorized):
```json
{
  "error": "Unauthorized"
}
```

## Товары

### Получение списка товаров

#### Получение всех товаров

**Endpoint**: `GET /products`

**Описание**: Возвращает список всех товаров с пагинацией.

**Query Parameters**:
- `page` (integer, optional): Номер страницы (по умолчанию: 1)
- `pageSize` (integer, optional): Количество товаров на странице (по умолчанию: 10)
- `sort` (string, optional): Поле для сортировки (например, "price", "name")
- `order` (string, optional): Порядок сортировки ("asc" или "desc")
- `search` (string, optional): Поисковый запрос

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": 0.0,
      "imageUrl": "string",
      "inStock": 0,
      "type": "string",
      "additionalInfo": {}
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

#### Получение товара по ID

**Endpoint**: `GET /products/{id}`

**Описание**: Возвращает детальную информацию о товаре по его ID.

**Path Parameters**:
- `id` (string): Идентификатор товара

**Response** (200 OK):
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 0.0,
  "imageUrl": "string",
  "inStock": 0,
  "type": "string",
  "additionalInfo": {}
}
```

**Response** (404 Not Found):
```json
{
  "error": "Product not found"
}
```

#### Получение списка игр

**Endpoint**: `GET /games`

**Описание**: Возвращает список всех игр с пагинацией.

**Query Parameters**:
- `page` (integer, optional): Номер страницы (по умолчанию: 1)
- `pageSize` (integer, optional): Количество товаров на странице (по умолчанию: 10)
- `genre` (string, optional): Фильтр по жанру
- `platform` (string, optional): Фильтр по платформе
- `minPrice` (number, optional): Минимальная цена
- `maxPrice` (number, optional): Максимальная цена
- `sort` (string, optional): Поле для сортировки
- `order` (string, optional): Порядок сортировки

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": 0.0,
      "imageUrl": "string",
      "inStock": 0,
      "genre": "string",
      "publisher": "string",
      "releaseDate": "date",
      "platform": "string",
      "ageRating": "string"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

#### Получение списка консолей

**Endpoint**: `GET /consoles`

**Описание**: Возвращает список всех игровых консолей с пагинацией.

**Query Parameters**:
- `page` (integer, optional): Номер страницы (по умолчанию: 1)
- `pageSize` (integer, optional): Количество товаров на странице (по умолчанию: 10)
- `manufacturer` (string, optional): Фильтр по производителю
- `minPrice` (number, optional): Минимальная цена
- `maxPrice` (number, optional): Максимальная цена
- `sort` (string, optional): Поле для сортировки
- `order` (string, optional): Порядок сортировки

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": 0.0,
      "imageUrl": "string",
      "inStock": 0,
      "manufacturer": "string",
      "storageSize": "string",
      "color": "string",
      "isDigitalOnly": false,
      "specifications": "string"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

#### Получение списка аксессуаров

**Endpoint**: `GET /accessories`

**Описание**: Возвращает список всех аксессуаров с пагинацией.

**Query Parameters**:
- `page` (integer, optional): Номер страницы (по умолчанию: 1)
- `pageSize` (integer, optional): Количество товаров на странице (по умолчанию: 10)
- `type` (string, optional): Фильтр по типу аксессуара
- `compatibleWith` (string, optional): Фильтр по совместимости
- `manufacturer` (string, optional): Фильтр по производителю
- `minPrice` (number, optional): Минимальная цена
- `maxPrice` (number, optional): Максимальная цена
- `sort` (string, optional): Поле для сортировки
- `order` (string, optional): Порядок сортировки

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": 0.0,
      "imageUrl": "string",
      "inStock": 0,
      "type": "string",
      "compatibleWith": "string",
      "manufacturer": "string"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

### Управление товарами (только для администраторов)

#### Создание нового товара

**Endpoint**: `POST /products`

**Описание**: Создает новый товар в системе.

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "price": 0.0,
  "imageUrl": "string",
  "inStock": 0,
  "type": "string",
  "additionalInfo": {}
}
```

**Response** (201 Created):
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 0.0,
  "imageUrl": "string",
  "inStock": 0,
  "type": "string",
  "additionalInfo": {}
}
```

**Response** (400 Bad Request):
```json
{
  "error": "string",
  "details": {
    "field": "error message"
  }
}
```

**Response** (401 Unauthorized):
```json
{
  "error": "Unauthorized"
}
```

**Response** (403 Forbidden):
```json
{
  "error": "Insufficient permissions"
}
```

#### Обновление товара

**Endpoint**: `PUT /products/{id}`

**Описание**: Обновляет информацию о существующем товаре.

**Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
- `id` (string): Идентификатор товара

**Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "price": 0.0,
  "imageUrl": "string",
  "inStock": 0,
  "type": "string",
  "additionalInfo": {}
}
```

**Response** (200 OK):
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 0.0,
  "imageUrl": "string",
  "inStock": 0,
  "type": "string",
  "additionalInfo": {}
}
```

**Response** (404 Not Found):
```json
{
  "error": "Product not found"
}
```

#### Удаление товара

**Endpoint**: `DELETE /products/{id}`

**Описание**: Удаляет товар из системы.

**Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
- `id` (string): Идентификатор товара

**Response** (204 No Content)

**Response** (404 Not Found):
```json
{
  "error": "Product not found"
}
```

## Корзина

### Получение содержимого корзины

**Endpoint**: `GET /cart`

**Описание**: Возвращает содержимое корзины текущего пользователя.

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "string",
      "productId": "string",
      "productName": "string",
      "productImageUrl": "string",
      "price": 0.0,
      "quantity": 0,
      "totalPrice": 0.0
    }
  ],
  "totalItems": 0,
  "totalPrice": 0.0
}
```

### Добавление товара в корзину

**Endpoint**: `POST /cart`

**Описание**: Добавляет товар в корзину пользователя.

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "productId": "string",
  "quantity": 0
}
```

**Response** (201 Created):
```json
{
  "id": "string",
  "productId": "string",
  "productName": "string",
  "productImageUrl": "string",
  "price": 0.0,
  "quantity": 0,
  "totalPrice": 0.0
}
```

**Response** (400 Bad Request):
```json
{
  "error": "string",
  "details": {
    "field": "error message"
  }
}
```

### Изменение количества товара в корзине

**Endpoint**: `PUT /cart/{id}`

**Описание**: Изменяет количество товара в корзине.

**Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
- `id` (string): Идентификатор элемента корзины

**Request Body**:
```json
{
  "quantity": 0
}
```

**Response** (200 OK):
```json
{
  "id": "string",
  "productId": "string",
  "productName": "string",
  "productImageUrl": "string",
  "price": 0.0,
  "quantity": 0,
  "totalPrice": 0.0
}
```

**Response** (404 Not Found):
```json
{
  "error": "Cart item not found"
}
```

### Удаление товара из корзины

**Endpoint**: `DELETE /cart/{id}`

**Описание**: Удаляет товар из корзины.

**Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
- `id` (string): Идентификатор элемента корзины

**Response** (204 No Content)

**Response** (404 Not Found):
```json
{
  "error": "Cart item not found"
}
```

### Очистка корзины

**Endpoint**: `DELETE /cart`

**Описание**: Удаляет все товары из корзины пользователя.

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (204 No Content)

## Заказы

### Получение списка заказов пользователя

**Endpoint**: `GET /orders`

**Описание**: Возвращает список заказов текущего пользователя.

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `page` (integer, optional): Номер страницы (по умолчанию: 1)
- `pageSize` (integer, optional): Количество заказов на странице (по умолчанию: 10)
- `status` (string, optional): Фильтр по статусу заказа

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "string",
      "orderDate": "datetime",
      "status": "string",
      "totalAmount": 0.0,
      "itemsCount": 0
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

### Получение информации о заказе

**Endpoint**: `GET /orders/{id}`

**Описание**: Возвращает детальную информацию о заказе.

**Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
- `id` (string): Идентификатор заказа

**Response** (200 OK):
```json
{
  "id": "string",
  "userId": "string",
  "orderDate": "datetime",
  "status": "string",
  "totalAmount": 0.0,
  "deliveryAddress": "string",
  "paymentMethod": "string",
  "items": [
    {
      "id": "string",
      "productId": "string",
      "productName": "string",
      "price": 0.0,
      "quantity": 0,
      "totalPrice": 0.0
    }
  ]
}
```

**Response** (404 Not Found):
```json
{
  "error": "Order not found"
}
```

### Создание нового заказа

**Endpoint**: `POST /orders`

**Описание**: Создает новый заказ на основе содержимого корзины пользователя.

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "deliveryAddress": "string",
  "paymentMethod": "string"
}
```

**Response** (201 Created):
```json
{
  "id": "string",
  "userId": "string",
  "orderDate": "datetime",
  "status": "string",
  "totalAmount": 0.0,
  "deliveryAddress": "string",
  "paymentMethod": "string",
  "items": [
    {
      "id": "string",
      "productId": "string",
      "productName": "string",
      "price": 0.0,
      "quantity": 0,
      "totalPrice": 0.0
    }
  ]
}
```

**Response** (400 Bad Request):
```json
{
  "error": "string",
  "details": {
    "field": "error message"
  }
}
```

### Изменение статуса заказа (только для администраторов)

**Endpoint**: `PUT /orders/{id}/status`

**Описание**: Изменяет статус заказа.

**Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
- `id` (string): Идентификатор заказа

**Request Body**:
```json
{
  "status": "string"
}
```

**Response** (200 OK):
```json
{
  "id": "string",
  "status": "string",
  "updatedAt": "datetime"
}
```

**Response** (404 Not Found):
```json
{
  "error": "Order not found"
}
```

**Response** (403 Forbidden):
```json
{
  "error": "Insufficient permissions"
}
```

## Отзывы

### Получение отзывов о товаре

**Endpoint**: `GET /products/{productId}/reviews`

**Описание**: Возвращает список отзывов о товаре.

**Path Parameters**:
- `productId` (string): Идентификатор товара

**Query Parameters**:
- `page` (integer, optional): Номер страницы (по умолчанию: 1)
- `pageSize` (integer, optional): Количество отзывов на странице (по умолчанию: 10)
- `sort` (string, optional): Поле для сортировки
- `order` (string, optional): Порядок сортировки

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "string",
      "userId": "string",
      "username": "string",
      "rating": 0,
      "comment": "string",
      "createdAt": "datetime"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
```

### Добавление отзыва о товаре

**Endpoint**: `POST /products/{productId}/reviews`

**Описание**: Добавляет новый отзыв о товаре.

**Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
- `productId` (string): Идентификатор товара

**Request Body**:
```json
{
  "rating": 0,
  "comment": "string"
}
```

**Response** (201 Created):
```json
{
  "id": "string",
  "userId": "string",
  "username": "string",
  "rating": 0,
  "comment": "string",
  "createdAt": "datetime"
}
```

**Response** (400 Bad Request):
```json
{
  "error": "string",
  "details": {
    "field": "error message"
  }
}
```

## Коды ошибок

API использует стандартные HTTP коды состояния для индикации успеха или неудачи запроса:

- **200 OK**: Запрос выполнен успешно
- **201 Created**: Ресурс успешно создан
- **204 No Content**: Запрос выполнен успешно, но нет данных для возврата
- **400 Bad Request**: Ошибка в запросе (неверные параметры или данные)
- **401 Unauthorized**: Требуется аутентификация
- **403 Forbidden**: Недостаточно прав для выполнения операции
- **404 Not Found**: Запрашиваемый ресурс не найден
- **500 Internal Server Error**: Внутренняя ошибка сервера

## Ограничения и лимиты

- Максимальное количество запросов: 100 запросов в минуту с одного IP-адреса
- Максимальный размер запроса: 10 МБ
- Максимальное количество товаров в корзине: 50
- Максимальное количество товаров на странице: 100

## Версионирование

API поддерживает версионирование через URL-путь. Текущая версия API: `v1`.

## Примеры использования

### Пример авторизации и получения списка товаров

```javascript
// Авторизация
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const authData = await loginResponse.json();
const token = authData.token;

// Получение списка игр
const gamesResponse = await fetch('http://localhost:5000/api/games?page=1&pageSize=10&genre=Action', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const games = await gamesResponse.json();
console.log(games);
```

### Пример добавления товара в корзину и создания заказа

```javascript
// Добавление товара в корзину
const addToCartResponse = await fetch('http://localhost:5000/api/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: '123',
    quantity: 2
  })
});

// Создание заказа
const createOrderResponse = await fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    deliveryAddress: '123 Main St, City, Country',
    paymentMethod: 'credit_card'
  })
});

const order = await createOrderResponse.json();
console.log(order);
``` 