/** @type {import('next').NextConfig} */
import nextI18NextConfig from './next-i18next.config.mjs';

const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'], // Add the domain for Google profile pictures
  },
  i18n: nextI18NextConfig.i18n,
};

export default nextConfig;