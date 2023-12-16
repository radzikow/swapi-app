import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsResolver } from './planets.resolver';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from 'src/shared/cache/cache.module';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [PlanetsResolver, PlanetsService],
})
export class PlanetsModule {}
