import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CachedResource } from './entities/cached-resource.entity';
import { CachedData } from './dto/cached-data.dto';

@Injectable()
export class CacheService {
  constructor(
    @InjectModel(CachedResource.name)
    private readonly cacheModel: Model<CachedResource>,
  ) {}

  async get<T>(key: string): Promise<CachedData<T> | null> {
    const cachedData = await this.cacheModel.findOne({
      key,
      expiresAt: { $gt: new Date() },
    });

    return cachedData
      ? { data: cachedData.value as T, expiresAt: cachedData.expiresAt }
      : null;
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    const expiresAt = new Date(Date.now() + ttl * 1000);

    await this.cacheModel.updateOne(
      { key },
      { key, value, expiresAt },
      { upsert: true },
    );
  }
}
