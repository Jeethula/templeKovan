/** @type {import('next').NextConfig} */
import nextI18NextConfig from './next-i18next.config.mjs';
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});

export default withPWA({
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com'], // Add the domain for Google profile pictures
  },
  i18n: nextI18NextConfig.i18n,
});

// const nextConfig = {
//   images: {
//     unoptimized: true,
//     domains: ['lh3.googleusercontent.com'], // Add the domain for Google profile pictures
//   },
//   i18n: nextI18NextConfig.i18n,
// };

// export default nextConfig;