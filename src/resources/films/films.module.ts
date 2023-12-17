import { Global, Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsResolver } from './films.resolver';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '../../shared/cache/cache.module';

@Global()
@Module({
  imports: [HttpModule, CacheModule],
  providers: [FilmsResolver, FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}
