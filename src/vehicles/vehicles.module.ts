import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesResolver } from './vehicles.resolver';
import { HttpModule } from '@nestjs/axios';
import { FilmsModule } from '../films/films.module';

@Module({
  imports: [HttpModule, FilmsModule],
  providers: [VehiclesResolver, VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
