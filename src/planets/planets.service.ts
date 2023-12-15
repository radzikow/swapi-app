import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Planet } from './entities/planet.entity';
import { Resource } from 'src/common/enums/resource.enum';
import { GenericEntityService } from 'src/shared/generic-entity.service';

@Injectable()
export class PlanetsService extends GenericEntityService<Planet> {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, Resource.Planets);
  }
}
