import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
        host: process.env.REDIS_HOST, // Adjust based on your Redis setup
        port: parseInt(process.env.REDIS_PORT ? process.env.REDIS_PORT : "") || 6479,        // Adjust based on your Redis setup
      });
  }

  async setToken(userId: string, token: string) {
    await this.client.set(userId, token, 'EX', 3600); // Token expires in 1 hour
  }

  async getToken(userId: string): Promise<string | null> {
    return this.client.get(userId);
  }

  async removeToken(token: string) {
    // Assuming token is stored as a key, adjust accordingly
    await this.client.del(token);
  }
}
