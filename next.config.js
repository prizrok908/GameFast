/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://gamefast-backend.onrender.com/api/:path*',
      },
      {
        source: '/images/:path*',
        destination: 'https://gamefast-backend.onrender.com/images/:path*',
      },
      {
        source: '/wwwroot/:path*',
        destination: 'https://gamefast-backend.onrender.com/wwwroot/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 