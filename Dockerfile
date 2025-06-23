FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Копируем файлы проекта и восстанавливаем зависимости
COPY Backend/*.csproj ./Backend/
COPY coursework.sln ./
RUN dotnet restore

# Копируем остальные файлы и собираем приложение
COPY . ./
RUN dotnet publish -c Release -o out

# Создаем финальный образ
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Переменные окружения для подключения к БД и т.д.
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080
ENTRYPOINT ["dotnet", "Backend.dll"] 