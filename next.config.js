/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Desabilitar headers de segurança que podem bloquear
  async headers() {
    return [];
  },
};

module.exports = nextConfig;



