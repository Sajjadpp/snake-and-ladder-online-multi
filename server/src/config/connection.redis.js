const { createClient } = require("redis");

let redisClient = null;

async function connectRedis() {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL,
            socket: {
                reconnectStrategy(retries) {
                    if (retries > 5) {
                        console.error("Max Redis reconnect attempts reached.");
                        return false; // Stop reconnecting
                    }
                    return Math.min(retries * 100, 2000);
                },
            },
        });
    
        redisClient.on("connect", () => {
            console.log('Redis client connected');
        });
    
        redisClient.on("error", (err) => {
            console.error("Redis error:", err);
        });
    
        await redisClient.connect();
        return redisClient;
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        throw error; // Re-throw to let caller handle
    }
}

async function disconnectRedis() {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
    }
}

function getRedisClient() {
    if (!redisClient) {
        throw new Error("Redis client not initialized. Call connectRedis() first.");
    }
    return redisClient;
}

module.exports = { connectRedis, disconnectRedis, getRedisClient };