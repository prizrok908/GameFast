// Конфигурация API URL в зависимости от окружения
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://gamefast-backend.onrender.com/api' 
  : 'http://localhost:5000/api';

export default {
  API_URL
}; 