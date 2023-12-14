import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsResolver } from './planets.resolver';
import { HttpModule } from '@nestjs/axios';
import { FilmsModule } from '../films/films.module';

@Module({
  imports: [HttpModule, FilmsModule],
  providers: [PlanetsResolver, PlanetsService],
})
export class PlanetsModule {}
