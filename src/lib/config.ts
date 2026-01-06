// Database configuration from environment variables

// MongoDB Configuration
export const MONGODB_CONFIG = {
  clusterName: import.meta.env.VITE_MONGODB_CLUSTER_NAME || 'Cluster0',
  databaseName: import.meta.env.VITE_MONGODB_DATABASE_NAME || 'telugu_workers_hub',
  username: import.meta.env.VITE_MONGODB_USERNAME || '',
  password: import.meta.env.VITE_MONGODB_PASSWORD || '',
  clusterUrl: import.meta.env.VITE_MONGODB_CLUSTER_URL || '',
  
  // Data API configuration
  dataApiUrl: import.meta.env.VITE_MONGODB_DATA_API_URL || '',
  apiKey: import.meta.env.VITE_MONGODB_API_KEY || '',
  appId: import.meta.env.VITE_MONGODB_APP_ID || '',
  
  // Connection string
  connectionString: import.meta.env.VITE_MONGODB_CONNECTION_STRING || '',
  
  // Collection names
  collections: {
    users: 'users',
    workers: 'workers',
    categories: 'categories',
    bookings: 'bookings',
    reviews: 'reviews',
    favorites: 'user_favorites',
    workerImages: 'worker_images'
  }
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Database validation functions
export const validateMongoDBConfig = (): boolean => {
  const hasConnectionString = !!MONGODB_CONFIG.connectionString;
  const hasDataAPI = !!(MONGODB_CONFIG.apiKey && MONGODB_CONFIG.appId);
  const hasBasicConfig = !!(MONGODB_CONFIG.username && MONGODB_CONFIG.password && MONGODB_CONFIG.clusterUrl);
  
  return hasConnectionString || hasDataAPI || hasBasicConfig;
};

export const validateFirebaseConfig = (): boolean => {
  const requiredFields = [
    FIREBASE_CONFIG.apiKey,
    FIREBASE_CONFIG.authDomain,
    FIREBASE_CONFIG.projectId
  ];
  
  return requiredFields.every(field => !!field);
};

// Get database type based on configuration
export const getDatabaseType = (): 'mongodb' | 'firebase' | 'mock' => {
  if (validateMongoDBConfig()) {
    return 'mongodb';
  } else if (validateFirebaseConfig()) {
    return 'firebase';
  } else {
    return 'mock';
  }
};

// Application configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Telugu Workers Hub',
  env: import.meta.env.VITE_APP_ENV || 'development',
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  jwtSecret: import.meta.env.VITE_JWT_SECRET || 'default-secret-key',
  jwtExpiry: import.meta.env.VITE_JWT_EXPIRY || '7d',
  debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  mockData: import.meta.env.VITE_MOCK_DATA !== 'false' // Default to true for development
};

// Feature flags
export const FEATURES = {
  userRegistration: import.meta.env.VITE_ENABLE_USER_REGISTRATION !== 'false',
  workerRegistration: import.meta.env.VITE_ENABLE_WORKER_REGISTRATION !== 'false',
  bookingSystem: import.meta.env.VITE_ENABLE_BOOKING_SYSTEM !== 'false',
  paymentGateway: import.meta.env.VITE_ENABLE_PAYMENT_GATEWAY === 'true'
};

// Log configuration status
if (APP_CONFIG.debugMode) {
  console.log('🔧 Database Configuration Status:');
  console.log(`  Database Type: ${getDatabaseType()}`);
  console.log(`  MongoDB Valid: ${validateMongoDBConfig()}`);
  console.log(`  Firebase Valid: ${validateFirebaseConfig()}`);
  console.log(`  Mock Data: ${APP_CONFIG.mockData}`);
  console.log(`  Environment: ${APP_CONFIG.env}`);
}