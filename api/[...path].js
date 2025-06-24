// api/[...path].js - Middleware для обработки всех запросов API
const https = require('https');

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

  // Получаем путь API из запроса
  const { path } = req.query;
  const apiPath = path ? `/${path.join('/')}` : '';
  const apiUrl = `https://gamefast-backend.onrender.com/api${apiPath}`;

  console.log(`Proxying request to: ${apiUrl}`);

  // Опции для запроса к API
  const options = {
    method: req.method,
    headers: req.headers,
  };

  // Удаляем заголовки, которые могут вызвать проблемы
  delete options.headers.host;
  delete options.headers.connection;

  // Создаем запрос к API
  const apiReq = https.request(apiUrl, options, (apiRes) => {
    // Копируем заголовки ответа
    Object.entries(apiRes.headers).forEach(([key, value]) => {
      if (key.toLowerCase() !== 'content-length') {
        res.setHeader(key, value);
      }
    });

    // Устанавливаем статус ответа
    res.statusCode = apiRes.statusCode;

    // Получаем данные ответа
    let data = [];
    apiRes.on('data', (chunk) => {
      data.push(chunk);
    });

    // Отправляем ответ
    apiRes.on('end', () => {
      const responseBody = Buffer.concat(data);
      res.end(responseBody);
    });
  });

  // Обрабатываем ошибки запроса
  apiReq.on('error', (error) => {
    console.error(`Error proxying request: ${error.message}`);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  });

  // Если есть тело запроса, отправляем его
  if (req.body) {
    apiReq.write(JSON.stringify(req.body));
  }

  // Завершаем запрос
  apiReq.end();
}; 