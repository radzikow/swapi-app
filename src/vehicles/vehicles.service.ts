import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ApiResponse } from '../common/types/api-response.type';
import { catchError, firstValueFrom } from 'rxjs';
import { Vehicle } from './entities/vehicle.entity';
import { AxiosError } from 'axios';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);
  constructor(private readonly httpService: HttpService) {}

  async getVehicles(): Promise<ApiResponse<Vehicle>> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://swapi.dev/api/vehicles').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened while fetching vehicles!';
        }),
      ),
    );
    return data;
  }

  async getVehicleById(id: number): Promise<Vehicle> {
    const { data } = await firstValueFrom(
      this.httpService.get<any>(`https://swapi.dev/api/vehicles/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened while fetching vehicles!';
        }),
      ),
    );
    return data;
  }
}
