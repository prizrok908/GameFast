// _middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  // Получаем ответ
  const response = NextResponse.next();

  // Добавляем заголовки CORS
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Обработка OPTIONS запросов
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: response.headers,
    });
  }

  return response;
}

// Применяем middleware ко всем путям
export const config = {
  matcher: '/:path*',
}; 