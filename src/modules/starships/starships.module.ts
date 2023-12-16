import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsResolver } from './starships.resolver';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '../../shared/cache/cache.module';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [StarshipsResolver, StarshipsService],
  exports: [StarshipsService],
})
export class StarshipsModule {}
