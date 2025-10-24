#!/usr/bin/env node

/**
 * Dependency Verification Script
 * This script checks if all required dependencies are available
 */

console.log('🔍 Verifying dependencies...');

const requiredDeps = [
  'express',
  'cors', 
  'razorpay',
  'dotenv',
  'firebase-admin',
  'axios'
];

let allDepsAvailable = true;

requiredDeps.forEach(dep => {
  try {
    require(dep);
    console.log(`✅ ${dep} - Available`);
  } catch (error) {
    console.log(`❌ ${dep} - Missing`);
    allDepsAvailable = false;
  }
});

if (allDepsAvailable) {
  console.log('🎉 All dependencies are available!');
  process.exit(0);
} else {
  console.log('❌ Some dependencies are missing. Please run: npm install');
  process.exit(1);
}
