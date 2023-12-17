import { Global, Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsResolver } from './planets.resolver';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '../../shared/cache/cache.module';

@Global()
@Module({
  imports: [HttpModule, CacheModule],
  providers: [PlanetsResolver, PlanetsService],
  exports: [PlanetsService],
})
export class PlanetsModule {}
