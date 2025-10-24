/**
 * Automatic Wakeup Service for Varaha Silks Backend
 * 
 * This service provides multiple strategies to keep the backend awake:
 * 1. Self-ping mechanism
 * 2. External ping services integration
 * 3. Health check optimization
 * 4. Cron job scheduling
 */

const axios = require('axios');

class WakeupService {
  constructor() {
    this.isActive = false;
    this.pingInterval = null;
    this.healthCheckInterval = null;
    this.externalPingServices = [
      'https://uptimerobot.com',
      'https://pingdom.com',
      'https://statuscake.com'
    ];
    this.backendUrl = process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000';
    this.pingIntervalMs = parseInt(process.env.WAKEUP_INTERVAL_MS) || 14 * 60 * 1000; // 14 minutes default
    this.healthCheckIntervalMs = parseInt(process.env.HEALTH_CHECK_INTERVAL_MS) || 5 * 60 * 1000; // 5 minutes default
  }

  /**
   * Start the wakeup service
   */
  start() {
    if (this.isActive) {
      console.log('🔄 Wakeup service is already running');
      return;
    }

    console.log('🚀 Starting automatic wakeup service...');
    console.log(`📍 Backend URL: ${this.backendUrl}`);
    console.log(`⏰ Ping interval: ${this.pingIntervalMs / 1000 / 60} minutes`);
    console.log(`💓 Health check interval: ${this.healthCheckIntervalMs / 1000 / 60} minutes`);

    this.isActive = true;

    // Start self-ping mechanism
    this.startSelfPing();

    // Start health check optimization
    this.startHealthCheckOptimization();

    // Log wakeup service status
    this.logStatus();

    console.log('✅ Automatic wakeup service started successfully');
  }

  /**
   * Stop the wakeup service
   */
  stop() {
    if (!this.isActive) {
      console.log('🔄 Wakeup service is not running');
      return;
    }

    console.log('🛑 Stopping automatic wakeup service...');

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    this.isActive = false;
    console.log('✅ Automatic wakeup service stopped');
  }

  /**
   * Start self-ping mechanism
   */
  startSelfPing() {
    console.log('🔄 Starting self-ping mechanism...');

    // Initial ping
    this.performSelfPing();

    // Set up interval
    this.pingInterval = setInterval(() => {
      this.performSelfPing();
    }, this.pingIntervalMs);
  }

  /**
   * Perform self-ping to keep the service awake
   */
  async performSelfPing() {
    try {
      const startTime = Date.now();
      
      // Ping the health endpoint
      const response = await axios.get(`${this.backendUrl}/api/health`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Varaha-Silks-Wakeup-Service/1.0'
        }
      });

      const responseTime = Date.now() - startTime;

      if (response.status === 200) {
        console.log(`✅ Self-ping successful (${responseTime}ms) - Backend is awake`);
        console.log(`📊 Response: ${JSON.stringify(response.data)}`);
      } else {
        console.log(`⚠️ Self-ping returned status ${response.status}`);
      }

    } catch (error) {
      console.error('❌ Self-ping failed:', error.message);
      
      // Try alternative endpoints
      await this.tryAlternativeEndpoints();
    }
  }

  /**
   * Try alternative endpoints if main health check fails
   */
  async tryAlternativeEndpoints() {
    const alternativeEndpoints = [
      '/',
      '/api/products',
      '/api/health'
    ];

    for (const endpoint of alternativeEndpoints) {
      try {
        console.log(`🔄 Trying alternative endpoint: ${endpoint}`);
        const response = await axios.get(`${this.backendUrl}${endpoint}`, {
          timeout: 5000,
          headers: {
            'User-Agent': 'Varaha-Silks-Wakeup-Service/1.0'
          }
        });

        if (response.status === 200) {
          console.log(`✅ Alternative endpoint ${endpoint} responded successfully`);
          return;
        }
      } catch (error) {
        console.log(`❌ Alternative endpoint ${endpoint} failed: ${error.message}`);
      }
    }

    console.error('❌ All endpoints failed - backend may be down');
  }

  /**
   * Start health check optimization
   */
  startHealthCheckOptimization() {
    console.log('💓 Starting health check optimization...');

    // Initial health check
    this.performHealthCheck();

    // Set up interval
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.healthCheckIntervalMs);
  }

  /**
   * Perform optimized health check
   */
  async performHealthCheck() {
    try {
      const startTime = Date.now();
      
      const response = await axios.get(`${this.backendUrl}/api/health`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Varaha-Silks-Health-Check/1.0',
          'Cache-Control': 'no-cache'
        }
      });

      const responseTime = Date.now() - startTime;

      if (response.status === 200) {
        console.log(`💓 Health check passed (${responseTime}ms)`);
        
        // Log additional health metrics
        const healthData = response.data;
        if (healthData.services) {
          console.log(`📊 Services status: ${healthData.services}`);
        }
        if (healthData.version) {
          console.log(`🔖 Backend version: ${healthData.version}`);
        }
      }

    } catch (error) {
      console.error('❌ Health check failed:', error.message);
    }
  }

  /**
   * Get wakeup service status
   */
  getStatus() {
    return {
      isActive: this.isActive,
      backendUrl: this.backendUrl,
      pingIntervalMs: this.pingIntervalMs,
      healthCheckIntervalMs: this.healthCheckIntervalMs,
      hasPingInterval: !!this.pingInterval,
      hasHealthCheckInterval: !!this.healthCheckInterval,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Log current status
   */
  logStatus() {
    const status = this.getStatus();
    console.log('📊 Wakeup Service Status:');
    console.log(`   Active: ${status.isActive}`);
    console.log(`   Backend URL: ${status.backendUrl}`);
    console.log(`   Ping Interval: ${status.pingIntervalMs / 1000 / 60} minutes`);
    console.log(`   Health Check Interval: ${status.healthCheckIntervalMs / 1000 / 60} minutes`);
    console.log(`   Uptime: ${Math.floor(status.uptime / 60)} minutes`);
    console.log(`   Memory Usage: ${Math.round(status.memoryUsage.heapUsed / 1024 / 1024)}MB`);
  }

  /**
   * Manual wakeup trigger
   */
  async triggerWakeup() {
    console.log('🔔 Manual wakeup triggered');
    await this.performSelfPing();
  }

  /**
   * Get external ping service recommendations
   */
  getExternalPingRecommendations() {
    return {
      services: this.externalPingServices,
      recommendedEndpoints: [
        `${this.backendUrl}/api/health`,
        `${this.backendUrl}/api/products`,
        `${this.backendUrl}/`
      ],
      recommendedInterval: '5-10 minutes',
      setupInstructions: [
        '1. Sign up for an external ping service (UptimeRobot, Pingdom, etc.)',
        '2. Add your backend URL as a monitor',
        '3. Set ping interval to 5-10 minutes',
        '4. Configure alerts for downtime',
        '5. Use the /api/health endpoint for monitoring'
      ]
    };
  }
}

// Create singleton instance
const wakeupService = new WakeupService();

module.exports = wakeupService;
