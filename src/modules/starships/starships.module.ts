import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsResolver } from './starships.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [StarshipsResolver, StarshipsService],
  exports: [StarshipsService],
})
export class StarshipsModule {}
