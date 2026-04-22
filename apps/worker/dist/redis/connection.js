"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisConnection = createRedisConnection;
const ioredis_1 = __importDefault(require("ioredis"));
async function createRedisConnection(redisUrl, shouldConnect, onError) {
    const connection = new ioredis_1.default(redisUrl, {
        lazyConnect: true,
        connectTimeout: 5_000,
        maxRetriesPerRequest: null,
    });
    connection.on('error', (error) => {
        onError?.(error);
    });
    if (shouldConnect) {
        try {
            await connection.connect();
        }
        catch (error) {
            connection.disconnect();
            throw error;
        }
    }
    return connection;
}
//# sourceMappingURL=connection.js.map