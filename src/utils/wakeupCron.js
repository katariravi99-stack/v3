#!/usr/bin/env node

/**
 * Automated Wakeup Cron Script for Varaha Silks Backend
 * 
 * This script can be run as a cron job to keep the backend awake.
 * It performs various wakeup strategies and can be scheduled to run every few minutes.
 * 
 * Usage:
 * - Direct execution: node src/utils/wakeupCron.js
 * - Cron job: */5 * * * * node /path/to/src/utils/wakeupCron.js
 * - PM2: pm2 start src/utils/wakeupCron.js --cron "*/5 * * * *"
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class WakeupCron {
  constructor() {
    this.backendUrl = process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000';
    this.logFile = path.join(__dirname, '../../logs/wakeup-cron.log');
    this.maxLogSize = 10 * 1024 * 1024; // 10MB
    this.retryAttempts = 3;
    this.retryDelay = 5000; // 5 seconds
  }

  /**
   * Initialize the wakeup cron
   */
  async init() {
    console.log('🚀 Starting Wakeup Cron Job...');
    console.log(`📍 Backend URL: ${this.backendUrl}`);
    console.log(`📝 Log file: ${this.logFile}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);

    // Ensure log directory exists
    this.ensureLogDirectory();

    // Perform wakeup operations
    await this.performWakeup();

    console.log('✅ Wakeup Cron Job completed');
  }

  /**
   * Ensure log directory exists
   */
  ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  /**
   * Perform wakeup operations
   */
  async performWakeup() {
    const startTime = Date.now();
    let success = false;
    let error = null;

    try {
      // Try multiple wakeup strategies
      await this.tryHealthCheck();
      await this.tryWakeupEndpoint();
      await this.tryProductsEndpoint();
      
      success = true;
      console.log('✅ All wakeup operations completed successfully');
      
    } catch (err) {
      error = err;
      console.error('❌ Wakeup operations failed:', err.message);
    }

    const duration = Date.now() - startTime;
    
    // Log the result
    await this.logResult({
      timestamp: new Date().toISOString(),
      success,
      duration,
      error: error ? error.message : null,
      backendUrl: this.backendUrl
    });

    if (!success) {
      process.exit(1);
    }
  }

  /**
   * Try health check endpoint
   */
  async tryHealthCheck() {
    console.log('🔄 Trying health check endpoint...');
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await axios.get(`${this.backendUrl}/api/health`, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Varaha-Silks-Wakeup-Cron/1.0'
          }
        });

        if (response.status === 200) {
          console.log(`✅ Health check successful (attempt ${attempt})`);
          return;
        }
      } catch (err) {
        console.log(`❌ Health check attempt ${attempt} failed: ${err.message}`);
        
        if (attempt < this.retryAttempts) {
          console.log(`⏳ Retrying in ${this.retryDelay / 1000} seconds...`);
          await this.sleep(this.retryDelay);
        } else {
          throw new Error(`Health check failed after ${this.retryAttempts} attempts: ${err.message}`);
        }
      }
    }
  }

  /**
   * Try wakeup endpoint
   */
  async tryWakeupEndpoint() {
    console.log('🔄 Trying wakeup endpoint...');
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await axios.get(`${this.backendUrl}/api/wakeup`, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Varaha-Silks-Wakeup-Cron/1.0'
          }
        });

        if (response.status === 200) {
          console.log(`✅ Wakeup endpoint successful (attempt ${attempt})`);
          return;
        }
      } catch (err) {
        console.log(`❌ Wakeup endpoint attempt ${attempt} failed: ${err.message}`);
        
        if (attempt < this.retryAttempts) {
          console.log(`⏳ Retrying in ${this.retryDelay / 1000} seconds...`);
          await this.sleep(this.retryDelay);
        } else {
          throw new Error(`Wakeup endpoint failed after ${this.retryAttempts} attempts: ${err.message}`);
        }
      }
    }
  }

  /**
   * Try products endpoint
   */
  async tryProductsEndpoint() {
    console.log('🔄 Trying products endpoint...');
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await axios.get(`${this.backendUrl}/api/products`, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Varaha-Silks-Wakeup-Cron/1.0'
          }
        });

        if (response.status === 200) {
          console.log(`✅ Products endpoint successful (attempt ${attempt})`);
          return;
        }
      } catch (err) {
        console.log(`❌ Products endpoint attempt ${attempt} failed: ${err.message}`);
        
        if (attempt < this.retryAttempts) {
          console.log(`⏳ Retrying in ${this.retryDelay / 1000} seconds...`);
          await this.sleep(this.retryDelay);
        } else {
          throw new Error(`Products endpoint failed after ${this.retryAttempts} attempts: ${err.message}`);
        }
      }
    }
  }

  /**
   * Log the result to file
   */
  async logResult(result) {
    try {
      const logEntry = JSON.stringify(result) + '\n';
      
      // Check if log file is too large
      if (fs.existsSync(this.logFile)) {
        const stats = fs.statSync(this.logFile);
        if (stats.size > this.maxLogSize) {
          // Rotate log file
          const rotatedFile = this.logFile + '.old';
          if (fs.existsSync(rotatedFile)) {
            fs.unlinkSync(rotatedFile);
          }
          fs.renameSync(this.logFile, rotatedFile);
        }
      }
      
      fs.appendFileSync(this.logFile, logEntry);
      console.log(`📝 Result logged to ${this.logFile}`);
      
    } catch (err) {
      console.error('❌ Failed to log result:', err.message);
    }
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get cron job recommendations
   */
  getCronRecommendations() {
    return {
      cronExpressions: [
        '*/5 * * * *',  // Every 5 minutes
        '*/10 * * * *', // Every 10 minutes
        '*/15 * * * *', // Every 15 minutes
        '*/30 * * * *'  // Every 30 minutes
      ],
      recommended: '*/10 * * * *', // Every 10 minutes
      setupInstructions: [
        '1. Open crontab: crontab -e',
        '2. Add this line: */10 * * * * cd /path/to/your/project && node src/utils/wakeupCron.js',
        '3. Save and exit',
        '4. Verify: crontab -l',
        '5. Check logs: tail -f logs/wakeup-cron.log'
      ],
      pm2Setup: [
        '1. Install PM2: npm install -g pm2',
        '2. Create ecosystem file: pm2 ecosystem',
        '3. Add wakeup cron to ecosystem.config.js',
        '4. Start: pm2 start ecosystem.config.js',
        '5. Save: pm2 save && pm2 startup'
      ]
    };
  }
}

// Run the wakeup cron if this file is executed directly
if (require.main === module) {
  const wakeupCron = new WakeupCron();
  wakeupCron.init().catch(err => {
    console.error('❌ Wakeup cron failed:', err);
    process.exit(1);
  });
}

module.exports = WakeupCron;
