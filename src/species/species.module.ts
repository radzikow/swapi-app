import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesResolver } from './species.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [SpeciesResolver, SpeciesService],
})
export class SpeciesModule {}
