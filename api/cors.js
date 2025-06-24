// api/cors.js - Middleware для обработки CORS в Vercel
module.exports = (req, res) => {
  // Устанавливаем заголовки CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Обработка OPTIONS запросов
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Для других запросов просто продолжаем выполнение
  return {
    props: {},
  };
}; 