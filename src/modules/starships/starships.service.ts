import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Resource } from '../../common/enums/resource.enum';
import { GenericEntityService } from '../../shared/generic-entity.service';
import { Starship } from './entities/starship.entity';

@Injectable()
export class StarshipsService extends GenericEntityService<Starship> {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, Resource.Starships);
  }
}
