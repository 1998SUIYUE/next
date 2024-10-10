/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    ppr: 'incremental',
  },
  env: {
    NEXTAUTH_URL: 'http://47.109.95.152:3000',
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
  },
  productionBrowserSourceMaps: true,
  transpilePackages: ['antd', '@ant-design/cssinjs'],
};

export default nextConfig;
