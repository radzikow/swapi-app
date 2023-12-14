import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Film } from './entities/film.entity';
import { ApiResponse } from 'src/common/types/api-response.type';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger(FilmsService.name);
  constructor(private readonly httpService: HttpService) {}

  async getFilms(): Promise<ApiResponse<Film>> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://swapi.dev/api/films').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

  async getFilmById(id: number): Promise<Film> {
    const { data } = await firstValueFrom(
      this.httpService.get<any>(`https://swapi.dev/api/films/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
