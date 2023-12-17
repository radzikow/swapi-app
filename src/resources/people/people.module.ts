import { Global, Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleResolver } from './people.resolver';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '../../shared/cache/cache.module';

@Global()
@Module({
  imports: [HttpModule, CacheModule],
  providers: [PeopleResolver, PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
