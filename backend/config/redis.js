import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      console.error('Redis connection refused');
      return new Error('Redis server connection refused');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      console.error('Redis retry time exhausted');
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      console.error('Redis max attempts reached');
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

// Redis event handlers
redisClient.on('connect', () => {
  console.log('✅ Redis client connected');
});

redisClient.on('ready', () => {
  console.log('✅ Redis client ready');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis client error:', err);
});

redisClient.on('end', () => {
  console.log('🔌 Redis client disconnected');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('🚀 Redis connection established');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    process.exit(1);
  }
};

// Initialize connection
connectRedis();

export default redisClient;
