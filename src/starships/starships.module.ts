import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsResolver } from './starships.resolver';
import { HttpModule } from '@nestjs/axios';
import { FilmsModule } from '../films/films.module';

@Module({
  imports: [HttpModule, FilmsModule],
  providers: [StarshipsResolver, StarshipsService],
})
export class StarshipsModule {}
