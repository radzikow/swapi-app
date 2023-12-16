import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CachedResource,
  CachedResourceSchema,
} from './entities/cached-resource.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CachedResource.name, schema: CachedResourceSchema },
    ]),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
