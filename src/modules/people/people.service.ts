import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { People } from './entities/people.entity';
import { Resource } from '../../common/enums/resource.enum';
import { GenericEntityService } from '../../shared/generic-entity.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PeopleService extends GenericEntityService<People> {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
  ) {
    super(httpService, configService, Resource.People);
  }
}
