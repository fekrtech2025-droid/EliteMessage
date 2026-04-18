"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisConnection = createRedisConnection;
const ioredis_1 = __importDefault(require("ioredis"));
async function createRedisConnection(redisUrl, shouldConnect) {
    const connection = new ioredis_1.default(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: null,
    });
    if (shouldConnect) {
        await connection.connect();
    }
    return connection;
}
//# sourceMappingURL=connection.js.map