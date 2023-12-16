import { Global, Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsResolver } from './films.resolver';
import { HttpModule } from '@nestjs/axios';
import { SpeciesModule } from '../species/species.module';
import { CacheModule } from '../../shared/cache/cache.module';

@Global()
@Module({
  imports: [HttpModule, SpeciesModule, CacheModule],
  providers: [FilmsResolver, FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}
