/** @type {import('next').NextConfig} */

const nextConfig = {
  onDemandEntries: {
    // 页面可以保持被缓存的时间（ms）
    maxInactiveAge: 25 * 1000,
    // 同时保持缓存的页面数
    pagesBufferLength: 2,
  },
  webpack: (config, {  dev, isServer, defaultLoaders, webpack }) => {
    // 注意：这会在控制台输出大量信息
    config.infrastructureLogging = { debug: /webpack/, level: 'verbose' };
    return config;
  },
  experimental: {
    ppr: 'incremental',
  },
  env: {
    secret:process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL_INTERNAL,
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
