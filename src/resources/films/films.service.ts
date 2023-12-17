import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Film } from './entities/film.entity';
import { Resource } from '../../common/enums/resource.enum';
import { GenericEntityService } from '../../shared/generic-entity.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilmsService extends GenericEntityService<Film> {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService, Resource.Films);
  }

  async getOpeningCrawls(): Promise<string[]> {
    const { results: films } = await this.getAll();
    return films.map((film) => film.opening_crawl.replace(/[\r\n]/g, ' '));
  }
}
