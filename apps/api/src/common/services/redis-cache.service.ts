import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisCacheService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly client?: Redis;

  constructor() {
    const url = process.env.REDIS_URL;

    if (!url) {
      this.logger.warn("REDIS_URL not configured. Caching is disabled.");
      return;
    }

    this.client = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 1
    });

    this.client.on("error", (error) => {
      this.logger.warn(`Redis unavailable: ${error.message}`);
    });
  }

  async getJson<T>(key: string): Promise<T | null> {
    if (!this.client) {
      return null;
    }

    await this.ensureConnected();
    const value = await this.client.get(key);

    return value ? (JSON.parse(value) as T) : null;
  }

  async setJson(key: string, value: unknown, ttlSeconds = 60): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.ensureConnected();
    await this.client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  }

  async del(key: string): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.ensureConnected();
    await this.client.del(key);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
  }

  private async ensureConnected(): Promise<void> {
    if (!this.client) {
      return;
    }

    if (this.client.status === "wait") {
      await this.client.connect();
    }
  }
}
