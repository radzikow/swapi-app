import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Vehicle } from './entities/vehicle.entity';
import { Resource } from '../../common/enums/resource.enum';
import { GenericEntityService } from '../../shared/generic-entity.service';

@Injectable()
export class VehiclesService extends GenericEntityService<Vehicle> {
  constructor(protected readonly httpService: HttpService) {
    super(httpService, Resource.Vehicles);
  }
}
