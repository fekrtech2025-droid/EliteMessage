import Redis from 'ioredis';
export declare function createRedisConnection(redisUrl: string, shouldConnect: boolean, onError?: (error: Error) => void): Promise<Redis>;
//# sourceMappingURL=connection.d.ts.map