/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  // Remove static export configuration for development
  // output: 'export',
  // trailingSlash: true,
  // skipTrailingSlashRedirect: true,
  // distDir: 'out',
  
  // Add webpack configuration to handle cache issues
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable webpack cache in development to prevent corruption
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;