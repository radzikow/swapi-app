import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { People } from './entities/people.entity';
import { Resource } from '../../common/enums/resource.enum';
import { GenericEntityService } from '../../shared/generic-entity.service';

@Injectable()
export class PeopleService extends GenericEntityService<People> {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, Resource.People);
  }
}
