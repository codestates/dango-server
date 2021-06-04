module.exports = {
  apps: [
    {
      name: 'myapp',
      script: './dist/bin/www.js',
      watch: true,
      env: {
        PORT: 4000,
        NODE_ENV: 'development',
      },
      env_production: {
        PORT: 80,
        NODE_ENV: 'production',
      },
    },
  ],
};
