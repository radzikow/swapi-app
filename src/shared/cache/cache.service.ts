import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CachedResource } from './entities/cached-resource.entity';
import { CachedData } from './dto/cached-data.dto';

@Injectable()
export class CacheService {
  constructor(
    @InjectModel(CachedResource.name)
    private readonly cacheModel: Model<CachedResource>,
    private readonly logger: Logger,
  ) {}

  async get<T>(key: string): Promise<CachedData<T> | null> {
    try {
      const cachedData = await this.cacheModel.findOne({
        key,
        expiresAt: { $gt: new Date() },
      });

      if (cachedData) {
        this.logger.log(
          `Cached data with key "${key}" successfully retrieved.`,
        );

        return JSON.parse(cachedData.value as unknown as string);
      }

      return null;
    } catch (error) {
      this.logger.error(`Error retrieving cached data: ${error.message}`);
    }
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + ttl * 1000);

      await this.cacheModel.updateOne(
        { key },
        { key, value: JSON.stringify(value), expiresAt },
        { upsert: true },
      );
    } catch (error) {
      this.logger.error(`Error saving data in cache: ${error.message}`);
    } finally {
      this.logger.log(
        `Data successfully saved in the cache with key "${key}".`,
      );
    }
  }
}
