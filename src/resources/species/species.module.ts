import { Global, Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesResolver } from './species.resolver';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '../../shared/cache/cache.module';

@Global()
@Module({
  imports: [HttpModule, CacheModule],
  providers: [SpeciesResolver, SpeciesService],
  exports: [SpeciesService],
})
export class SpeciesModule {}
