module.exports = {
  apps: [
    {
      name: 'varaha-silks-backend',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        ENABLE_WAKEUP: 'true'
      },
      log_file: 'logs/backend.log',
      error_file: 'logs/backend-error.log',
      out_file: 'logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'varaha-silks-wakeup-cron',
      script: 'src/utils/wakeupCron.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '*/10 * * * *', // Every 10 minutes
      env: {
        NODE_ENV: 'production',
        BACKEND_URL: process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000'
      },
      log_file: 'logs/wakeup-cron.log',
      error_file: 'logs/wakeup-cron-error.log',
      out_file: 'logs/wakeup-cron-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: false, // Don't restart automatically, let cron handle it
      watch: false
    }
  ]
};
