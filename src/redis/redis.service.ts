import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
        host: '127.0.0.1', // Adjust based on your Redis setup
        port: 6379,        // Adjust based on your Redis setup
      });
  }

  async setToken(userId: string, token: string) {
    await this.client.set(userId, token, 'EX', 3600); // Token expires in 1 hour
  }

  async getToken(userId: string): Promise<string | null> {
    return this.client.get(userId);
  }
}
