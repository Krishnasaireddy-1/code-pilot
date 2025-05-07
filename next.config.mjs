// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
// next.config.js
// next.config.mjs
export default {
    experimental: {
      // remove turbo if it's there
      // turbo: true,
    },
    webpack: (config, { isServer }) => {
      return config;
    }
  };
  
  