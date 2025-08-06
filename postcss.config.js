const isDocker = process.env.DOCKER_ENV === 'true' || process.env.NODE_ENV === 'development';

module.exports = {
  plugins: {
    '@tailwindcss/postcss': isDocker ? {
      // Disable LightningCSS in Docker environment
      lightningcss: false,
    } : {},
    autoprefixer: {},
  },
};
