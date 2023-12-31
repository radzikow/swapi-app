import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Planet } from './entities/planet.entity';
import { Resource } from '../../common/enums/resource.enum';
import { GenericEntityService } from '../../shared/generic-entity.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlanetsService extends GenericEntityService<Planet> {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService, Resource.Planets);
  }
}
