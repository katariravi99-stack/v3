#!/usr/bin/env node

/**
 * Server Startup Script with Dependency Verification
 * This script verifies dependencies before starting the server
 */

console.log('🚀 Starting Varaha Silks Backend Server...');
console.log('📍 Current directory:', process.cwd());
console.log('📦 Node version:', process.version);
console.log('⏰ Started at:', new Date().toISOString());

// Check if node_modules exists
const fs = require('fs');
const path = require('path');

const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ node_modules directory not found!');
  console.error('Please run: npm install');
  process.exit(1);
}

console.log('✅ node_modules directory found');

// Verify critical dependencies
const criticalDeps = ['express', 'cors', 'dotenv'];
let missingDeps = [];

criticalDeps.forEach(dep => {
  try {
    require(dep);
    console.log(`✅ ${dep} - Available`);
  } catch (error) {
    console.log(`❌ ${dep} - Missing`);
    missingDeps.push(dep);
  }
});

if (missingDeps.length > 0) {
  console.error('❌ Missing critical dependencies:', missingDeps.join(', '));
  console.error('Please run: npm install');
  process.exit(1);
}

console.log('✅ All critical dependencies verified');
console.log('🚀 Starting server...');

// Start the actual server
try {
  require('./src/server.js');
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
