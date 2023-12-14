import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ApiResponse } from '../common/types/api-response.type';
import { Species } from './entities/species.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class SpeciesService {
  private readonly logger = new Logger(SpeciesService.name);
  constructor(private readonly httpService: HttpService) {}

  async getSpecies(): Promise<ApiResponse<Species>> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://swapi.dev/api/species').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened while fetching species!';
        }),
      ),
    );
    return data;
  }

  async getSpeciesById(id: number): Promise<Species> {
    const { data } = await firstValueFrom(
      this.httpService.get<any>(`https://swapi.dev/api/species/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened while fetching species!';
        }),
      ),
    );
    return data;
  }
}
