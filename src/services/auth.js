const { auth } = require('../config/firebase');

// User authentication operations using Firebase Admin SDK
const createUser = async (userData) => {
  try {
    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName || userData.name,
      phoneNumber: userData.phone ? `+91${userData.phone}` : undefined,
    });
    
    console.log('✅ User created successfully:', userRecord.uid);
    return userRecord;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const userRecord = await auth.getUserByEmail(email);
    return userRecord;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    console.error('Error getting user by email:', error);
    throw error;
  }
};

const getUserById = async (uid) => {
  try {
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

const updateUser = async (uid, updateData) => {
  try {
    const updateObject = {};
    
    if (updateData.email) updateObject.email = updateData.email;
    if (updateData.displayName) updateObject.displayName = updateData.displayName;
    if (updateData.phone) updateObject.phoneNumber = `+91${updateData.phone}`;
    if (updateData.password) updateObject.password = updateData.password;
    
    const userRecord = await auth.updateUser(uid, updateObject);
    console.log('✅ User updated successfully:', uid);
    return userRecord;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const deleteUser = async (uid) => {
  try {
    await auth.deleteUser(uid);
    console.log('✅ User deleted successfully:', uid);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

const listUsers = async (maxResults = 1000, pageToken) => {
  try {
    const listUsersResult = await auth.listUsers(maxResults, pageToken);
    return {
      users: listUsersResult.users,
      pageToken: listUsersResult.pageToken
    };
  } catch (error) {
    console.error('Error listing users:', error);
    throw error;
  }
};

const setCustomUserClaims = async (uid, customClaims) => {
  try {
    await auth.setCustomUserClaims(uid, customClaims);
    console.log('✅ Custom claims set for user:', uid);
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw error;
  }
};

const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw error;
  }
};

const createCustomToken = async (uid, additionalClaims) => {
  try {
    const customToken = await auth.createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('Error creating custom token:', error);
    throw error;
  }
};

const revokeRefreshTokens = async (uid) => {
  try {
    await auth.revokeRefreshTokens(uid);
    console.log('✅ Refresh tokens revoked for user:', uid);
  } catch (error) {
    console.error('Error revoking refresh tokens:', error);
    throw error;
  }
};

// Email verification
const generateEmailVerificationLink = async (email) => {
  try {
    const actionCodeSettings = {
      url: process.env.CLIENT_URL || 'http://localhost:3000',
      handleCodeInApp: true,
    };
    
    const link = await auth.generateEmailVerificationLink(email, actionCodeSettings);
    return link;
  } catch (error) {
    console.error('Error generating email verification link:', error);
    throw error;
  }
};

const generatePasswordResetLink = async (email) => {
  try {
    const actionCodeSettings = {
      url: process.env.CLIENT_URL || 'http://localhost:3000',
      handleCodeInApp: true,
    };
    
    const link = await auth.generatePasswordResetLink(email, actionCodeSettings);
    return link;
  } catch (error) {
    console.error('Error generating password reset link:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  listUsers,
  setCustomUserClaims,
  verifyIdToken,
  createCustomToken,
  revokeRefreshTokens,
  generateEmailVerificationLink,
  generatePasswordResetLink
};
