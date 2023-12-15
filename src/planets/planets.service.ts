import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import {
  ApiResponse,
  FormattedApiResponse,
  TimestampsAndIdentifier,
  TimestampsAndUrl,
} from '../common/types/api-response.type';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';
import { Planet } from './entities/planet.entity';
import { getIdFromUrl } from '../common/utilities/get-id-from-url.utility';

@Injectable()
export class PlanetsService {
  private readonly logger = new Logger(PlanetsService.name);
  constructor(private readonly httpService: HttpService) {}

  async getPlanets(
    skip: number,
    take: number,
  ): Promise<FormattedApiResponse<Planet>> {
    const pageSize = 10;
    const totalRequestedItems = take;
    let remainingItems = totalRequestedItems;

    const results: (Planet & TimestampsAndUrl)[] = [];
    const resourceTotalNumber: number = 0;

    while (remainingItems > 0) {
      const response = await firstValueFrom(
        this.httpService
          .get<ApiResponse<Planet>>(
            `https://swapi.dev/api/planets/?page=${Math.ceil(
              (skip + 1) / pageSize,
            )}`,
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw 'An error happened while fetching planets!';
            }),
          ),
      );

      const fetchedItems = response.data.results
        .slice(skip % pageSize, (skip % pageSize) + remainingItems)
        .map((planet) => ({
          ...planet,
          id: parseInt(getIdFromUrl(planet.url)),
        }));

      results.push(...fetchedItems);

      remainingItems -= fetchedItems.length;
      skip += fetchedItems.length;

      if (fetchedItems.length === 0) {
        break;
      }
    }

    const apiResponse: FormattedApiResponse<Planet> = {
      results,
      take,
      skip,
      total: resourceTotalNumber,
    };

    return apiResponse;
  }

  async getPlanetById(id: number): Promise<Planet> {
    return await firstValueFrom(
      this.httpService.get<any>(`https://swapi.dev/api/planets/${id}`).pipe(
        map((axiosResponse) => {
          const formattedPlanet: Planet & TimestampsAndIdentifier = {
            ...axiosResponse.data,
            id: parseInt(getIdFromUrl(axiosResponse.data.url)),
          };
          return formattedPlanet;
        }),
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened while fetching planets!';
        }),
      ),
    );
  }
}
