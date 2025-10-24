# 🚀 Automatic Wakeup Solution - Complete Implementation

## Overview

Your Varaha Silks backend now has a comprehensive automatic wakeup system that prevents it from going to sleep on hosting platforms like Render, Heroku, or other cloud providers.

## 🎯 What's Been Added

### 1. Built-in Wakeup Service (`src/services/wakeupService.js`)
- **Self-ping mechanism**: Automatically pings the backend every 14 minutes
- **Health check optimization**: Monitors backend health every 5 minutes
- **Retry logic**: Automatically retries failed requests
- **Comprehensive logging**: Detailed logs for monitoring and debugging
- **Status monitoring**: Real-time status of wakeup service

### 2. Wakeup Endpoints (Added to `src/server.js`)
- `GET /api/wakeup` - Wakeup endpoint for external ping services
- `GET /api/wakeup/status` - Wakeup service status and metrics
- `POST /api/wakeup/trigger` - Manual wakeup trigger
- `GET /api/wakeup/recommendations` - External ping service recommendations

### 3. Cron Job Script (`src/utils/wakeupCron.js`)
- **Standalone wakeup script**: Can be run as a cron job
- **Multiple endpoint testing**: Tests health, wakeup, and products endpoints
- **Retry mechanism**: Attempts multiple times on failure
- **Log rotation**: Automatically manages log file size
- **Comprehensive error handling**: Detailed error reporting

### 4. PM2 Integration (`ecosystem.config.js`)
- **Process management**: Manages both backend and wakeup cron
- **Automatic restart**: Handles process failures
- **Log management**: Centralized logging for all processes
- **Cron scheduling**: Built-in cron job scheduling

### 5. NPM Scripts (Updated `package.json`)
- `npm run wakeup` - Run wakeup cron once
- `npm run wakeup:dev` - Run wakeup cron in development
- `npm run wakeup:pm2` - Start wakeup cron with PM2
- `npm run pm2:start` - Start all PM2 processes
- `npm run pm2:status` - Check PM2 status


## 🚀 Quick Start Guide

### For Render Deployment (Recommended)

1. **Add Environment Variables in Render Dashboard:**
   ```
   ENABLE_WAKEUP=true
   BACKEND_URL=https://your-app-name.onrender.com
   ```

2. **Deploy your backend** - The wakeup service will start automatically

3. **Set up External Ping Service (Optional but Recommended):**
   - Go to [UptimeRobot](https://uptimerobot.com)
   - Add monitor: `https://your-app-name.onrender.com/api/health`
   - Set interval: 5 minutes

### For VPS/Server Deployment

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Start with PM2:**
   ```bash
   npm run pm2:start
   ```

3. **Save PM2 configuration:**
   ```bash
   npm run pm2:save
   npm run pm2:startup
   ```

### For Cron Job Setup

1. **Add to crontab:**
   ```bash
   crontab -e
   # Add this line:
   */10 * * * * cd /path/to/your/project && node src/utils/wakeupCron.js
   ```

## 🔧 Configuration Options

### Environment Variables

```env
# Enable wakeup service
ENABLE_WAKEUP=true

# Backend URL for self-ping
BACKEND_URL=https://your-backend-url.com

# Wakeup intervals (optional)
WAKEUP_INTERVAL_MS=840000      # 14 minutes
HEALTH_CHECK_INTERVAL_MS=300000 # 5 minutes
```

### Wakeup Strategies

1. **Built-in Service** (Automatic)
   - Starts with backend in production
   - Self-pings every 14 minutes
   - Health checks every 5 minutes

2. **External Ping Services** (Recommended)
   - UptimeRobot, Pingdom, StatusCake
   - Monitor `/api/health` or `/api/wakeup`
   - Set 5-10 minute intervals

3. **Cron Job** (Manual)
   - Run `src/utils/wakeupCron.js` every 10 minutes
   - Can be scheduled with crontab or PM2

4. **PM2 Process** (Advanced)
   - Built-in cron scheduling
   - Process management
   - Automatic restart

## 📊 Monitoring and Logs

### Available Endpoints

- `GET /api/health` - Basic health check
- `GET /api/wakeup` - Wakeup endpoint
- `GET /api/wakeup/status` - Wakeup service status
- `POST /api/wakeup/trigger` - Manual wakeup
- `GET /api/wakeup/recommendations` - External service recommendations

### Log Files

- `logs/wakeup-cron.log` - Wakeup cron logs
- `logs/backend.log` - Backend application logs
- `logs/wakeup-cron-error.log` - Wakeup cron errors

### Monitoring Commands

```bash
# Test wakeup functionality
curl https://your-backend-url.com/api/wakeup/status

# Check wakeup status
curl https://your-backend-url.com/api/wakeup/status

# View PM2 status
npm run pm2:status

# View logs
npm run pm2:logs
```

## 🛠️ Troubleshooting

### Common Issues

1. **Wakeup service not starting**
   - Check `ENABLE_WAKEUP=true` in environment
   - Verify `NODE_ENV=production`
   - Check backend logs

2. **Self-ping failures**
   - Verify `BACKEND_URL` is correct
   - Check network connectivity
   - Review wakeup logs

3. **Cron job not working**
   - Check crontab: `crontab -l`
   - Verify file paths
   - Check cron logs

### Debug Commands

```bash
# Test all wakeup functionality
curl https://your-backend-url.com/api/wakeup/status

# Check wakeup service status
curl https://your-backend-url.com/api/wakeup/status

# View recent logs
tail -f logs/wakeup-cron.log

# Check PM2 status
pm2 status
```

## 📈 Performance Impact

- **Minimal resource usage**: Wakeup service uses <1MB RAM
- **Lightweight requests**: Self-ping requests are small
- **Optimized intervals**: Balanced between keeping awake and resource usage
- **Automatic log rotation**: Prevents log files from growing too large

## 🔒 Security Considerations

- Wakeup endpoints are public (by design for external ping services)
- No sensitive data is exposed in wakeup responses
- Logs may contain URLs (ensure no secrets in URLs)
- All external communications use HTTPS

## 📚 Documentation

- **WAKEUP_SETUP.md** - Detailed setup instructions
- **DEPLOYMENT.md** - Updated with wakeup information
- **ecosystem.config.js** - PM2 configuration
- **package.json** - Updated with wakeup scripts

## 🎉 Benefits

1. **Prevents Sleep**: Backend stays awake on hosting platforms
2. **Multiple Strategies**: Built-in service + external ping services
3. **Automatic Recovery**: Retry logic handles temporary failures
4. **Comprehensive Monitoring**: Detailed logs and status endpoints
5. **Easy Setup**: Simple environment variables
6. **Flexible Deployment**: Works with Render, VPS, PM2, cron jobs
7. **Production Ready**: Robust error handling and logging

## 🚀 Next Steps

1. **Deploy with wakeup enabled** by setting `ENABLE_WAKEUP=true`
2. **Set up external ping service** for redundancy
3. **Monitor logs** to ensure everything is working
4. **Test wakeup functionality** by checking the wakeup endpoints
5. **Enjoy your always-awake backend!** 🎉

Your backend is now equipped with a comprehensive wakeup system that will keep it running smoothly on any hosting platform!
