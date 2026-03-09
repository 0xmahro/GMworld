/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    if (Array.isArray(config.externals)) {
      config.externals.push('pino-pretty', 'encoding');
    }
    return config;
  },
};

module.exports = nextConfig;
