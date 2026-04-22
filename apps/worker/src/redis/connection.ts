import Redis from 'ioredis';

export async function createRedisConnection(
  redisUrl: string,
  shouldConnect: boolean,
  onError?: (error: Error) => void,
) {
  const connection = new Redis(redisUrl, {
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
    } catch (error) {
      connection.disconnect();
      throw error;
    }
  }

  return connection;
}
