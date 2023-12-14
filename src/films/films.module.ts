import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsResolver } from './films.resolver';
import { HttpModule } from '@nestjs/axios';
import { SpeciesModule } from 'src/species/species.module';

@Module({
  imports: [HttpModule, SpeciesModule],
  providers: [FilmsResolver, FilmsService],
})
export class FilmsModule {}
