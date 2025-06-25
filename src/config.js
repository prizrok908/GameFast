// Конфигурация API URL в зависимости от окружения
const isProduction = process.env.NODE_ENV === 'production' || 
                    window.location.hostname.includes('vercel.app') ||
                    window.location.hostname !== 'localhost';

// Для локальной разработки используем удаленный бэкенд
const API_URL = isProduction
  ? '/api' // Используем относительный путь для прокси через Vercel
  : 'https://gamefast-backend.onrender.com/api'; // Используем удаленный бэкенд для разработки

// Функция для формирования URL изображений
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Заглушки для изображений
  const placeholders = {
    '/images/games/god-of-war.jpg': 'https://i.imgur.com/3wB4dQS.jpg',
    '/images/games/horizon.jpg': 'https://i.imgur.com/Hx8kALT.jpg',
    '/images/consoles/ps5.jpg': 'https://i.imgur.com/5HCjJjJ.jpg',
    '/images/consoles/ps5-digital.jpg': 'https://i.imgur.com/mWxH0Mj.jpg',
    '/images/accessories/dualsense.jpg': 'https://i.imgur.com/WlUjwQN.jpg',
    '/images/accessories/pulse-3d.jpg': 'https://i.imgur.com/3ybQAVL.jpg',
    '/images/subscriptions/ps-plus-essential.jpg': 'https://i.imgur.com/qQYGSMQ.png',
    '/images/subscriptions/ps-plus-extra.jpg': 'https://i.imgur.com/BuNpLod.png',
    '/images/subscriptions/ps-plus-premium.jpg': 'https://i.imgur.com/hYgmWwd.png',
  };

  // Если есть заглушка для этого пути, используем её
  if (placeholders[path]) {
    return placeholders[path];
  }

  // Иначе используем стандартную логику
  return isProduction
    ? path // Используем относительный путь для прокси через Vercel
    : `https://gamefast-backend.onrender.com${path}`; // Используем удаленный бэкенд для изображений
};

// Для отладки
console.log('Environment:', isProduction ? 'Production' : 'Development');
console.log('API URL:', API_URL);
console.log('Hostname:', window.location.hostname);

export default {
  API_URL,
  getImageUrl
}; 