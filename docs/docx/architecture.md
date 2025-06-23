# Архитектура проекта GameFast

## Общая архитектура

Проект GameFast построен на основе клиент-серверной архитектуры:

1. **Клиентская часть (фронтенд)**: Одностраничное приложение (SPA) на React
2. **Серверная часть (бэкенд)**: REST API на ASP.NET Core
3. **База данных**: SQLite

## Архитектура фронтенда

Фронтенд построен на основе компонентного подхода React:

- **Компоненты** (`/src/components/`) - переиспользуемые UI элементы
- **Стили** (`/src/styles/`) - CSS файлы для стилизации компонентов
- **Тесты** (`/src/__tests__/` и `/src/components/__tests__/`) - Jest тесты

### Основные компоненты:

- Страницы товаров (консоли, игры, аксессуары)
- Компоненты корзины
- Компоненты авторизации и регистрации
- Административная панель

## Архитектура бэкенда

Бэкенд построен на основе ASP.NET Core с использованием паттерна MVC:

- **Контроллеры** (`/Backend/Controllers/`) - обработка HTTP запросов
- **Модели** (`/Backend/Models/`) - классы данных
- **Контекст базы данных** (`/Backend/Data/ApplicationDbContext.cs`) - Entity Framework Core

### Основные контроллеры:

- `AuthController.cs` - авторизация и регистрация
- `ConsoleController.cs` - управление игровыми консолями
- `GameController.cs` - управление играми
- `AccessoriesController.cs` - управление аксессуарами
- `CartController.cs` - управление корзиной

## Модель данных

Основные сущности:

1. **BaseProduct** - базовый класс для всех товаров
   - Id
   - Name
   - Description
   - Price
   - ImageUrl

2. **Game** - наследуется от BaseProduct
   - Genre
   - ReleaseDate
   - Developer
   - Platform

3. **Console** - наследуется от BaseProduct
   - Manufacturer
   - ReleaseDate
   - Specifications

4. **Accessory** - наследуется от BaseProduct
   - Type
   - Compatibility

5. **User** - пользователь системы
   - Id
   - Username
   - Email
   - PasswordHash
   - Role

6. **CartItem** - элемент корзины
   - Id
   - ProductId
   - ProductType
   - Quantity
   - UserId

## API Endpoints

### Авторизация
- `POST /api/auth/register` - регистрация нового пользователя
- `POST /api/auth/login` - авторизация пользователя

### Товары
- `GET /api/games` - получение списка игр
- `GET /api/consoles` - получение списка консолей
- `GET /api/accessories` - получение списка аксессуаров
- `GET /api/{productType}/{id}` - получение информации о товаре

### Корзина
- `GET /api/cart` - получение корзины пользователя
- `POST /api/cart` - добавление товара в корзину
- `PUT /api/cart/{id}` - изменение количества товара в корзине
- `DELETE /api/cart/{id}` - удаление товара из корзины 