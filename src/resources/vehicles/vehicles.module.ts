import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesResolver } from './vehicles.resolver';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '../../shared/cache/cache.module';

@Module({
  imports: [HttpModule, CacheModule],
  providers: [VehiclesResolver, VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
