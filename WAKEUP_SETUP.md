# Automatic Wakeup Setup Guide for Varaha Silks Backend

This guide explains how to set up automatic wakeup functionality to prevent your backend from going to sleep on hosting platforms like Render, Heroku, or other cloud providers.

## 🚀 Features

- **Multiple Wakeup Strategies**: Self-ping, external ping services, health checks
- **Automatic Service**: Built-in wakeup service that runs with your backend
- **Cron Job Support**: Standalone cron script for external scheduling
- **PM2 Integration**: Process management with PM2 ecosystem
- **External Ping Endpoints**: Dedicated endpoints for external monitoring services
- **Comprehensive Logging**: Detailed logs for monitoring and debugging

## 📋 Quick Setup

### 1. Environment Variables

Add these environment variables to your deployment:

```env
# Enable wakeup service (set to 'true' for production)
ENABLE_WAKEUP=true

# Backend URL (for self-ping)
BACKEND_URL=https://your-backend-url.onrender.com

# Wakeup intervals (optional, defaults provided)
WAKEUP_INTERVAL_MS=840000  # 14 minutes
HEALTH_CHECK_INTERVAL_MS=300000  # 5 minutes
```

### 2. For Render Deployment

Add these environment variables in your Render dashboard:

- `ENABLE_WAKEUP=true`
- `BACKEND_URL=https://your-app-name.onrender.com`

## 🔧 Wakeup Strategies

### Strategy 1: Built-in Wakeup Service (Recommended)

The backend automatically starts a wakeup service in production mode:

```bash
# The service starts automatically when NODE_ENV=production
# or when ENABLE_WAKEUP=true
```

**Features:**
- Self-pings every 14 minutes
- Health checks every 5 minutes
- Automatic retry on failures
- Comprehensive logging

### Strategy 2: External Ping Services

Use external monitoring services to ping your backend:

**Recommended Services:**
- [UptimeRobot](https://uptimerobot.com) (Free tier: 5-minute intervals)
- [Pingdom](https://pingdom.com) (Free tier: 1-minute intervals)
- [StatusCake](https://statuscake.com) (Free tier: 5-minute intervals)

**Endpoints to Monitor:**
- `https://your-backend-url.onrender.com/api/health`
- `https://your-backend-url.onrender.com/api/wakeup`
- `https://your-backend-url.onrender.com/api/products`

### Strategy 3: Cron Job Script

Run the wakeup script as a cron job:

```bash
# Add to crontab (runs every 10 minutes)
*/10 * * * * cd /path/to/your/project && node src/utils/wakeupCron.js
```

**Setup:**
```bash
# Edit crontab
crontab -e

# Add this line (replace with your actual path)
*/10 * * * * cd /home/user/varaha-silks/server && node src/utils/wakeupCron.js

# Save and exit
# Verify with: crontab -l
```

### Strategy 4: PM2 Process Management

Use PM2 to manage both your backend and wakeup cron:

```bash
# Install PM2 globally
npm install -g pm2

# Start both backend and wakeup cron
npm run pm2:start

# Check status
npm run pm2:status

# View logs
npm run pm2:logs

# Save PM2 configuration
npm run pm2:save

# Setup PM2 to start on boot
npm run pm2:startup
```

## 📊 Monitoring and Logs

### Built-in Endpoints

- `GET /api/wakeup` - Wakeup endpoint for external ping services
- `GET /api/wakeup/status` - Wakeup service status
- `POST /api/wakeup/trigger` - Manual wakeup trigger
- `GET /api/wakeup/recommendations` - External ping service recommendations

### Log Files

- `logs/wakeup-cron.log` - Wakeup cron job logs
- `logs/backend.log` - Backend application logs
- `logs/wakeup-cron-error.log` - Wakeup cron error logs

### Monitoring Commands

```bash
# Check wakeup service status
curl https://your-backend-url.onrender.com/api/wakeup/status

# Trigger manual wakeup
curl -X POST https://your-backend-url.onrender.com/api/wakeup/trigger

# View wakeup recommendations
curl https://your-backend-url.onrender.com/api/wakeup/recommendations

# Check logs (if using PM2)
npm run pm2:logs
```

## 🛠️ Available Scripts

### NPM Scripts

```bash
# Wakeup scripts
npm run wakeup              # Run wakeup cron once
npm run wakeup:dev          # Run wakeup cron in development mode
npm run wakeup:test         # Test wakeup functionality
npm run wakeup:pm2          # Start wakeup cron with PM2
npm run wakeup:pm2:stop     # Stop wakeup cron
npm run wakeup:pm2:restart   # Restart wakeup cron
npm run wakeup:pm2:logs      # View wakeup cron logs

# PM2 scripts
npm run pm2:start           # Start all PM2 processes
npm run pm2:stop            # Stop all PM2 processes
npm run pm2:restart         # Restart all PM2 processes
npm run pm2:logs            # View all PM2 logs
npm run pm2:status          # Check PM2 status
npm run pm2:save            # Save PM2 configuration
npm run pm2:startup         # Setup PM2 to start on boot
```

## 🔍 Troubleshooting

### Common Issues

1. **Wakeup service not starting**
   - Check `ENABLE_WAKEUP` environment variable
   - Verify `NODE_ENV=production`
   - Check backend logs for errors

2. **Self-ping failures**
   - Verify `BACKEND_URL` is correct
   - Check if backend is accessible
   - Review network connectivity

3. **Cron job not working**
   - Check crontab: `crontab -l`
   - Verify file paths are correct
   - Check cron logs: `tail -f /var/log/cron`

4. **PM2 issues**
   - Check PM2 status: `pm2 status`
   - View PM2 logs: `pm2 logs`
   - Restart PM2: `pm2 restart all`

### Debug Commands

```bash
# Check wakeup service status
curl https://your-backend-url.onrender.com/api/wakeup/status

# View recent logs
tail -f logs/wakeup-cron.log

# Check PM2 status
pm2 status
pm2 logs varaha-silks-wakeup-cron
```

## 📈 Performance Considerations

### Recommended Intervals

- **Self-ping**: 14 minutes (Render's sleep threshold)
- **Health checks**: 5 minutes
- **External ping services**: 5-10 minutes
- **Cron jobs**: 10 minutes

### Resource Usage

- Wakeup service uses minimal resources
- Self-ping requests are lightweight
- Log files are automatically rotated
- Memory usage is optimized

## 🔒 Security Considerations

- Wakeup endpoints are public (by design)
- No sensitive data is exposed
- Logs may contain URLs (ensure no secrets in URLs)
- External ping services should use HTTPS

## 📝 Configuration Examples

### Render Environment Variables

```env
NODE_ENV=production
ENABLE_WAKEUP=true
BACKEND_URL=https://varaha-silks-backend.onrender.com
WAKEUP_INTERVAL_MS=840000
HEALTH_CHECK_INTERVAL_MS=300000
```

### Crontab Entry

```bash
# Every 10 minutes
*/10 * * * * cd /home/user/varaha-silks/server && node src/utils/wakeupCron.js >> logs/wakeup-cron.log 2>&1
```

### PM2 Ecosystem

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'varaha-silks-backend',
      script: 'dist/src/server.js',
      env: {
        NODE_ENV: 'production',
        ENABLE_WAKEUP: 'true'
      }
    },
    {
      name: 'varaha-silks-wakeup-cron',
      script: 'src/utils/wakeupCron.js',
      cron_restart: '*/10 * * * *'
    }
  ]
};
```

## 🎯 Best Practices

1. **Use Multiple Strategies**: Combine built-in service with external ping services
2. **Monitor Logs**: Regularly check wakeup logs for issues
3. **Test Regularly**: Use the wakeup endpoints to verify functionality
4. **Set Appropriate Intervals**: Balance between keeping awake and resource usage
5. **Use HTTPS**: Ensure all external ping services use HTTPS
6. **Backup Strategy**: Always have a fallback wakeup method

## 📞 Support

If you encounter issues with the wakeup functionality:

1. Check the logs first: `tail -f logs/wakeup-cron.log`
2. Test the wakeup endpoints manually
3. Verify environment variables are set correctly
4. Review the troubleshooting section above

The wakeup system is designed to be robust and self-healing, but monitoring is key to ensuring your backend stays awake!
