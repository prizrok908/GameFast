// Конфигурация API URL в зависимости от окружения
// Определяем, находимся ли мы в production среде (Vercel)
const isProduction = process.env.NODE_ENV === 'production' || 
                    window.location.hostname.includes('vercel.app') ||
                    window.location.hostname !== 'localhost';

const API_URL = isProduction
  ? '/api' // Используем относительный путь для прокси через Vercel
  : 'http://localhost:5000/api';

// Функция для формирования URL изображений
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  return isProduction
    ? path // Используем относительный путь для прокси через Vercel
    : `http://localhost:5000${path}`;
};

// Для отладки
console.log('Environment:', isProduction ? 'Production' : 'Development');
console.log('API URL:', API_URL);

export default {
  API_URL,
  getImageUrl
}; 