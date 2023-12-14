import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ApiResponse } from '../common/types/api-response.type';
import { Starship } from './entities/starship.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class StarshipsService {
  private readonly logger = new Logger(StarshipsService.name);
  constructor(private readonly httpService: HttpService) {}

  async getStarships(): Promise<ApiResponse<Starship>> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://swapi.dev/api/starships').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened while fetching starships!';
        }),
      ),
    );
    return data;
  }

  async getStarshipById(id: number): Promise<Starship> {
    const { data } = await firstValueFrom(
      this.httpService.get<any>(`https://swapi.dev/api/starships/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened while fetching starships!';
        }),
      ),
    );
    return data;
  }
}
