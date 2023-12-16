// cache.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CachedResource } from './entities/cached-resource.entity';

@Injectable()
export class CacheService {
  constructor(
    @InjectModel(CachedResource.name)
    private readonly cacheModel: Model<CachedResource>,
  ) {}

  async get(key: string): Promise<string | null> {
    const cachedData = await this.cacheModel.findOne({
      key,
      expiresAt: { $gt: new Date() },
    });

    return cachedData ? cachedData.value : null;
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    const expiresAt = new Date(Date.now() + ttl * 1000);

    await this.cacheModel.updateOne(
      { key },
      { key, value, expiresAt },
      { upsert: true },
    );
  }
}
