module.exports = {
  apps: [{
    name: 'hifumi',
    script: 'dist/index.js',
    max_restarts: 3,
    env: {
      NODE_ENV: 'DEVELOPMENT'
    },
    env_production: {
      NODE_ENV: 'PRODUCTION'
    }
  }],

  deploy: {
    production: {
      user: 'node',
      host: process.env.PRODUCTION_IP,
      ref: 'origin/master',
      repo: 'https://github.com/Xetera/Hifumi.git',
      path: '/root/Hifumi',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};