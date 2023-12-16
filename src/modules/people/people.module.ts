import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleResolver } from './people.resolver';
import { HttpModule } from '@nestjs/axios';
import { PlanetsModule } from '../planets/planets.module';
import { SpeciesModule } from '../species/species.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { StarshipsModule } from '../starships/starships.module';
import { CacheModule } from 'src/shared/cache/cache.module';

@Module({
  imports: [
    HttpModule,
    PlanetsModule,
    SpeciesModule,
    VehiclesModule,
    StarshipsModule,
    CacheModule,
  ],
  providers: [PeopleResolver, PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
