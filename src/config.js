// Конфигурация API URL в зависимости от окружения
// Определяем, находимся ли мы в production среде (Vercel)
const isProduction = process.env.NODE_ENV === 'production' || 
                    window.location.hostname.includes('vercel.app') ||
                    window.location.hostname !== 'localhost';

// Принудительно используем относительные пути для API
const API_URL = '/api';

// Функция для формирования URL изображений
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Принудительно используем относительные пути для изображений
  return path;
};

// Для отладки
console.log('Environment:', isProduction ? 'Production' : 'Development');
console.log('API URL:', API_URL);
console.log('Hostname:', window.location.hostname);

export default {
  API_URL,
  getImageUrl
}; 