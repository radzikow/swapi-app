import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Film } from './entities/film.entity';
import { Resource } from 'src/common/enums/resource.enum';
import { GenericEntityService } from 'src/shared/generic-entity.service';

@Injectable()
export class FilmsService extends GenericEntityService<Film> {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, Resource.Films);
  }
}
