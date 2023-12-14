import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ApiResponse } from '../common/types/api-response.type';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Planet } from './entities/planet.entity';

@Injectable()
export class PlanetsService {
  private readonly logger = new Logger(PlanetsService.name);
  constructor(private readonly httpService: HttpService) {}

  async getPlanets(): Promise<ApiResponse<Planet>> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://swapi.dev/api/planets').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened while fetching planets!';
        }),
      ),
    );
    return data;
  }

  async getPlanetById(id: number): Promise<Planet> {
    const { data } = await firstValueFrom(
      this.httpService.get<any>(`https://swapi.dev/api/planets/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened while fetching planets!';
        }),
      ),
    );
    return data;
  }
}
