// api/images.js - Middleware для проксирования запросов к изображениям
const https = require('https');

module.exports = (req, res) => {
  // Получаем путь к изображению из запроса
  const imagePath = req.url.replace(/^\/api\/images/, '');
  const imageUrl = `https://gamefast-backend.onrender.com/images${imagePath}`;

  console.log(`Proxying image request to: ${imageUrl}`);

  // Опции для запроса к API
  const options = {
    method: 'GET',
    headers: {
      ...req.headers,
      host: 'gamefast-backend.onrender.com',
    },
  };

  // Удаляем заголовки, которые могут вызвать проблемы
  delete options.headers.host;
  delete options.headers.connection;

  // Создаем запрос к API
  const apiReq = https.request(imageUrl, options, (apiRes) => {
    // Копируем заголовки ответа
    Object.entries(apiRes.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Устанавливаем статус ответа
    res.statusCode = apiRes.statusCode;

    // Передаем данные ответа
    apiRes.pipe(res);
  });

  // Обрабатываем ошибки запроса
  apiReq.on('error', (error) => {
    console.error(`Error proxying image request: ${error.message}`);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  });

  // Завершаем запрос
  apiReq.end();
}; 