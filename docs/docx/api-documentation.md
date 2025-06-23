# API документация GameFast

## Общая информация

Базовый URL: `http://localhost:5000/api`

Все запросы к API, кроме авторизации и регистрации, требуют заголовок авторизации:
```
Authorization: Bearer {token}
```

## Аутентификация

### Регистрация

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

**Response**:
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "token": "string"
}
```

### Авторизация

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "token": "string"
}
```

## Игры

### Получение списка игр

**Endpoint**: `GET /games`

**Query Parameters**:
- `pageNumber` (опционально): номер страницы (по умолчанию 1)
- `pageSize` (опционально): размер страницы (по умолчанию 10)
- `genre` (опционально): фильтр по жанру
- `platform` (опционально): фильтр по платформе

**Response**:
```json
{
  "items": [
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "price": "number",
      "imageUrl": "string",
      "genre": "string",
      "releaseDate": "date",
      "developer": "string",
      "platform": "string"
    }
  ],
  "totalCount": "integer",
  "pageNumber": "integer",
  "pageSize": "integer"
}
```

### Получение игры по ID

**Endpoint**: `GET /games/{id}`

**Response**:
```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string",
  "genre": "string",
  "releaseDate": "date",
  "developer": "string",
  "platform": "string"
}
```

## Консоли

### Получение списка консолей

**Endpoint**: `GET /consoles`

**Query Parameters**:
- `pageNumber` (опционально): номер страницы (по умолчанию 1)
- `pageSize` (опционально): размер страницы (по умолчанию 10)
- `manufacturer` (опционально): фильтр по производителю

**Response**:
```json
{
  "items": [
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "price": "number",
      "imageUrl": "string",
      "manufacturer": "string",
      "releaseDate": "date",
      "specifications": "string"
    }
  ],
  "totalCount": "integer",
  "pageNumber": "integer",
  "pageSize": "integer"
}
```

### Получение консоли по ID

**Endpoint**: `GET /consoles/{id}`

**Response**:
```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string",
  "manufacturer": "string",
  "releaseDate": "date",
  "specifications": "string"
}
```

## Аксессуары

### Получение списка аксессуаров

**Endpoint**: `GET /accessories`

**Query Parameters**:
- `pageNumber` (опционально): номер страницы (по умолчанию 1)
- `pageSize` (опционально): размер страницы (по умолчанию 10)
- `type` (опционально): фильтр по типу аксессуара
- `compatibility` (опционально): фильтр по совместимости

**Response**:
```json
{
  "items": [
    {
      "id": "integer",
      "name": "string",
      "description": "string",
      "price": "number",
      "imageUrl": "string",
      "type": "string",
      "compatibility": "string"
    }
  ],
  "totalCount": "integer",
  "pageNumber": "integer",
  "pageSize": "integer"
}
```

### Получение аксессуара по ID

**Endpoint**: `GET /accessories/{id}`

**Response**:
```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "price": "number",
  "imageUrl": "string",
  "type": "string",
  "compatibility": "string"
}
```

## Корзина

### Получение корзины пользователя

**Endpoint**: `GET /cart`

**Response**:
```json
{
  "items": [
    {
      "id": "integer",
      "productId": "integer",
      "productType": "string",
      "quantity": "integer",
      "name": "string",
      "price": "number",
      "imageUrl": "string"
    }
  ],
  "totalPrice": "number"
}
```

### Добавление товара в корзину

**Endpoint**: `POST /cart`

**Request Body**:
```json
{
  "productId": "integer",
  "productType": "string",
  "quantity": "integer"
}
```

**Response**:
```json
{
  "items": [
    {
      "id": "integer",
      "productId": "integer",
      "productType": "string",
      "quantity": "integer",
      "name": "string",
      "price": "number",
      "imageUrl": "string"
    }
  ],
  "totalPrice": "number"
}
```

### Изменение количества товара в корзине

**Endpoint**: `PUT /cart/{id}`

**Request Body**:
```json
{
  "quantity": "integer"
}
```

**Response**:
```json
{
  "items": [
    {
      "id": "integer",
      "productId": "integer",
      "productType": "string",
      "quantity": "integer",
      "name": "string",
      "price": "number",
      "imageUrl": "string"
    }
  ],
  "totalPrice": "number"
}
```

### Удаление товара из корзины

**Endpoint**: `DELETE /cart/{id}`

**Response**:
```json
{
  "items": [
    {
      "id": "integer",
      "productId": "integer",
      "productType": "string",
      "quantity": "integer",
      "name": "string",
      "price": "number",
      "imageUrl": "string"
    }
  ],
  "totalPrice": "number"
}
``` 