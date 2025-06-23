# Руководство по настройке среды разработки GameFast

Это руководство поможет вам настроить среду разработки для проекта GameFast. Мы рассмотрим установку необходимого программного обеспечения, настройку проекта и запуск приложения в режиме разработки.

## Содержание

1. [Требования](#требования)
2. [Установка необходимого ПО](#установка-необходимого-по)
   - [Node.js и npm](#nodejs-и-npm)
   - [.NET SDK](#net-sdk)
   - [Git](#git)
   - [IDE и текстовые редакторы](#ide-и-текстовые-редакторы)
3. [Клонирование репозитория](#клонирование-репозитория)
4. [Настройка фронтенда](#настройка-фронтенда)
   - [Установка зависимостей](#установка-зависимостей)
   - [Конфигурация окружения](#конфигурация-окружения-фронтенд)
   - [Запуск фронтенда](#запуск-фронтенда)
5. [Настройка бэкенда](#настройка-бэкенда)
   - [Восстановление пакетов NuGet](#восстановление-пакетов-nuget)
   - [Конфигурация базы данных](#конфигурация-базы-данных)
   - [Конфигурация окружения](#конфигурация-окружения-бэкенд)
   - [Запуск бэкенда](#запуск-бэкенда)
6. [Запуск полного стека](#запуск-полного-стека)
7. [Настройка для разработчиков](#настройка-для-разработчиков)
   - [Настройка отладки](#настройка-отладки)
   - [Настройка линтеров](#настройка-линтеров)
   - [Настройка тестов](#настройка-тестов)
8. [Часто возникающие проблемы](#часто-возникающие-проблемы)

## Требования

Для разработки проекта GameFast вам потребуется:

- **Операционная система**: Windows 10/11, macOS 10.15+ или Linux (Ubuntu 20.04+ рекомендуется)
- **Процессор**: 2+ ядра, 2.0+ ГГц
- **Оперативная память**: минимум 8 ГБ (рекомендуется 16 ГБ)
- **Дисковое пространство**: минимум 5 ГБ свободного места
- **Интернет-соединение**: для загрузки пакетов и зависимостей

## Установка необходимого ПО

### Node.js и npm

Для работы с фронтендом необходимо установить Node.js и npm (Node Package Manager).

#### Windows

1. Перейдите на [официальный сайт Node.js](https://nodejs.org/)
2. Скачайте и установите LTS (Long Term Support) версию
3. Следуйте инструкциям установщика
4. Проверьте установку, открыв командную строку и выполнив:
   ```
   node --version
   npm --version
   ```

#### macOS

1. Установите с помощью Homebrew:
   ```
   brew install node
   ```
2. Или скачайте установщик с [официального сайта](https://nodejs.org/)
3. Проверьте установку:
   ```
   node --version
   npm --version
   ```

#### Linux (Ubuntu/Debian)

1. Обновите списки пакетов:
   ```
   sudo apt update
   ```
2. Установите Node.js и npm:
   ```
   sudo apt install nodejs npm
   ```
3. Для установки последней версии можно использовать NodeSource:
   ```
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. Проверьте установку:
   ```
   node --version
   npm --version
   ```

### .NET SDK

Для работы с бэкендом необходимо установить .NET SDK.

#### Windows

1. Перейдите на [страницу загрузки .NET](https://dotnet.microsoft.com/download)
2. Скачайте и установите .NET SDK 7.0 или выше
3. Следуйте инструкциям установщика
4. Проверьте установку:
   ```
   dotnet --version
   ```

#### macOS

1. Установите с помощью Homebrew:
   ```
   brew install dotnet-sdk
   ```
2. Или скачайте установщик с [официального сайта](https://dotnet.microsoft.com/download)
3. Проверьте установку:
   ```
   dotnet --version
   ```

#### Linux (Ubuntu/Debian)

1. Добавьте репозиторий Microsoft:
   ```
   wget https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
   sudo dpkg -i packages-microsoft-prod.deb
   ```
2. Установите .NET SDK:
   ```
   sudo apt-get update
   sudo apt-get install -y apt-transport-https
   sudo apt-get update
   sudo apt-get install -y dotnet-sdk-7.0
   ```
3. Проверьте установку:
   ```
   dotnet --version
   ```

### Git

Для работы с репозиторием проекта необходимо установить Git.

#### Windows

1. Скачайте и установите Git с [официального сайта](https://git-scm.com/download/win)
2. Следуйте инструкциям установщика
3. Проверьте установку:
   ```
   git --version
   ```

#### macOS

1. Установите с помощью Homebrew:
   ```
   brew install git
   ```
2. Или скачайте установщик с [официального сайта](https://git-scm.com/download/mac)
3. Проверьте установку:
   ```
   git --version
   ```

#### Linux (Ubuntu/Debian)

1. Установите Git:
   ```
   sudo apt-get update
   sudo apt-get install git
   ```
2. Проверьте установку:
   ```
   git --version
   ```

### IDE и текстовые редакторы

Для разработки рекомендуется использовать:

#### Для фронтенда:
- [Visual Studio Code](https://code.visualstudio.com/) с расширениями:
  - ESLint
  - Prettier
  - React Developer Tools
  - JavaScript (ES6) code snippets
  - npm Intellisense

#### Для бэкенда:
- [Visual Studio](https://visualstudio.microsoft.com/) (Windows/Mac)
- [Visual Studio Code](https://code.visualstudio.com/) с расширениями:
  - C#
  - .NET Core Tools
  - NuGet Package Manager

## Клонирование репозитория

1. Откройте терминал или командную строку
2. Клонируйте репозиторий:
   ```
   git clone https://github.com/prizrok908/GameFast.git
   ```
3. Перейдите в директорию проекта:
   ```
   cd GameFast
   ```

## Настройка фронтенда

### Установка зависимостей

1. Перейдите в корневую директорию проекта (где находится файл `package.json`)
2. Установите зависимости:
   ```
   npm install
   ```

### Конфигурация окружения (фронтенд)

1. Создайте файл `.env.local` в корневой директории фронтенда:
   ```
   touch .env.local
   ```
2. Добавьте необходимые переменные окружения:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_IMAGES_URL=http://localhost:5000/images
   ```

### Запуск фронтенда

1. Запустите фронтенд в режиме разработки:
   ```
   npm start
   ```
2. Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)
3. Любые изменения в коде будут автоматически отображаться в браузере

## Настройка бэкенда

### Восстановление пакетов NuGet

1. Перейдите в директорию бэкенда:
   ```
   cd Backend
   ```
2. Восстановите пакеты NuGet:
   ```
   dotnet restore
   ```

### Конфигурация базы данных

1. База данных SQLite создается автоматически при первом запуске
2. Для настройки подключения отредактируйте файл `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Data Source=database.sqlite"
     }
   }
   ```
3. Для применения миграций выполните:
   ```
   dotnet ef database update
   ```

### Конфигурация окружения (бэкенд)

1. Для разработки используйте файл `appsettings.Development.json`:
   ```json
   {
     "Logging": {
       "LogLevel": {
         "Default": "Debug",
         "System": "Information",
         "Microsoft": "Information"
       }
     },
     "JwtSettings": {
       "SecretKey": "your_development_secret_key_here",
       "Issuer": "GameFast",
       "Audience": "GameFastClients",
       "ExpiryMinutes": 60
     }
   }
   ```

### Запуск бэкенда

1. Находясь в директории бэкенда, выполните:
   ```
   dotnet run
   ```
2. API будет доступно по адресу [http://localhost:5000/api](http://localhost:5000/api)
3. Swagger документация будет доступна по адресу [http://localhost:5000/swagger](http://localhost:5000/swagger)

## Запуск полного стека

Для одновременного запуска фронтенда и бэкенда вам потребуется два терминала:

1. Терминал 1 (фронтенд):
   ```
   cd /путь/к/проекту/GameFast
   npm start
   ```

2. Терминал 2 (бэкенд):
   ```
   cd /путь/к/проекту/GameFast/Backend
   dotnet run
   ```

## Настройка для разработчиков

### Настройка отладки

#### Отладка фронтенда

1. В Chrome или Edge установите расширение [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
2. Для отладки в VS Code:
   - Установите расширение Debugger for Chrome/Edge
   - Создайте конфигурацию запуска:
     ```json
     {
       "type": "chrome",
       "request": "launch",
       "name": "Launch Chrome against localhost",
       "url": "http://localhost:3000",
       "webRoot": "${workspaceFolder}"
     }
     ```

#### Отладка бэкенда

1. В VS Code:
   - Установите расширение C#
   - Создайте конфигурацию запуска:
     ```json
     {
       "name": ".NET Core Launch (web)",
       "type": "coreclr",
       "request": "launch",
       "preLaunchTask": "build",
       "program": "${workspaceFolder}/Backend/bin/Debug/net7.0/Backend.dll",
       "args": [],
       "cwd": "${workspaceFolder}/Backend",
       "stopAtEntry": false,
       "serverReadyAction": {
         "action": "openExternally",
         "pattern": "\\bNow listening on:\\s+(https?://\\S+)"
       },
       "env": {
         "ASPNETCORE_ENVIRONMENT": "Development"
       }
     }
     ```

### Настройка линтеров

#### ESLint для фронтенда

1. ESLint уже настроен в проекте
2. Для запуска проверки:
   ```
   npm run lint
   ```
3. Для автоматического исправления:
   ```
   npm run lint:fix
   ```

#### StyleCop для бэкенда

1. Установите пакет StyleCop.Analyzers через NuGet
2. Настройки находятся в файле `.editorconfig`

### Настройка тестов

#### Тесты фронтенда (Jest)

1. Для запуска тестов:
   ```
   npm test
   ```
2. Для запуска тестов с покрытием:
   ```
   npm test -- --coverage
   ```

#### Тесты бэкенда (xUnit)

1. Перейдите в директорию с тестами:
   ```
   cd Backend.Tests
   ```
2. Запустите тесты:
   ```
   dotnet test
   ```

## Часто возникающие проблемы

### Проблемы с CORS

Если возникают проблемы с CORS при запросах с фронтенда на бэкенд:

1. Убедитесь, что в бэкенде настроен CORS для localhost:3000:
   ```csharp
   services.AddCors(options =>
   {
       options.AddPolicy("Development", builder =>
       {
           builder.WithOrigins("http://localhost:3000")
                 .AllowAnyHeader()
                 .AllowAnyMethod();
       });
   });
   ```

2. Убедитесь, что в коде фронтенда используется правильный URL API:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
   ```

### Проблемы с установкой пакетов npm

Если возникают ошибки при установке пакетов npm:

1. Очистите кэш npm:
   ```
   npm cache clean --force
   ```
2. Удалите папку node_modules и файл package-lock.json:
   ```
   rm -rf node_modules
   rm package-lock.json
   ```
3. Переустановите пакеты:
   ```
   npm install
   ```

### Проблемы с базой данных

Если возникают проблемы с базой данных SQLite:

1. Удалите файл базы данных:
   ```
   rm Backend/database.sqlite
   ```
2. Примените миграции заново:
   ```
   cd Backend
   dotnet ef database update
   ```

### Проблемы с запуском бэкенда

Если порт 5000 уже занят:

1. Измените порт в файле `Properties/launchSettings.json`:
   ```json
   {
     "profiles": {
       "Backend": {
         "applicationUrl": "http://localhost:5001"
       }
     }
   }
   ```
2. Обновите URL API в файле `.env.local` фронтенда:
   ```
   REACT_APP_API_URL=http://localhost:5001/api
   ``` 