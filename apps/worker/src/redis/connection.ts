import Redis from 'ioredis';

export async function createRedisConnection(
  redisUrl: string,
  shouldConnect: boolean,
) {
  const connection = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: null,
  });

  if (shouldConnect) {
    await connection.connect();
  }

  return connection;
}
