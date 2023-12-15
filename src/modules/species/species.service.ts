import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Species } from './entities/species.entity';
import { Resource } from 'src/common/enums/resource.enum';
import { GenericEntityService } from 'src/shared/generic-entity.service';

@Injectable()
export class SpeciesService extends GenericEntityService<Species> {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, Resource.Species);
  }
}
