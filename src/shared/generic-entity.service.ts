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
import { getIdFromUrl } from '../common/utilities/url.utility';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenericEntityService<T> {
  swapiUrl = this.configService.get<number>('swapi.url');
  defaultPaginationSkip = this.configService.get<number>(
    'default.pagination.skip',
  );
  defaultPaginationTake = this.configService.get<number>(
    'swapi.pagination.take',
  );

  private readonly logger = new Logger(this.entityName);

  constructor(
    protected readonly httpService: HttpService,
    protected readonly configService: ConfigService,
    private readonly entityName: string,
  ) {}

  async getAll(
    search: string = '',
    skip: number = this.defaultPaginationSkip,
    take: number = this.defaultPaginationTake,
  ): Promise<FormattedApiResponse<T>> {
    const baseUrl = `${this.swapiUrl}/${this.entityName}/`;
    let formattedUrl = '';

    const results: (T & TimestampsAndIdentifier)[] = [];
    const resourceTotalNumber: number = 0;

    if (search !== '') {
      formattedUrl = `${baseUrl}?search=${search}`;

      const response = await firstValueFrom(
        this.httpService
          .get<ApiResponse<T & TimestampsAndUrl>>(formattedUrl)
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw `An error happened while fetching ${this.entityName}!`;
            }),
          ),
      );

      const fetchedItems = response.data.results.map((item) => ({
        ...item,
        id: parseInt(getIdFromUrl(item.url)),
      }));

      results.push(...fetchedItems);
    }

    if (search === '') {
      const pageSize = 10;
      const totalRequestedItems = take;
      let remainingItems = totalRequestedItems;

      while (remainingItems > 0) {
        const response = await firstValueFrom(
          this.httpService
            .get<ApiResponse<T & TimestampsAndUrl>>(
              `${baseUrl}?page=${Math.ceil((skip + 1) / pageSize)}`,
            )
            .pipe(
              catchError((error: AxiosError) => {
                this.logger.error(error.response.data);
                throw `An error happened while fetching ${this.entityName}!`;
              }),
            ),
        );

        const fetchedItems = response.data.results
          .slice(skip % pageSize, (skip % pageSize) + remainingItems)
          .map((item) => ({
            ...item,
            id: parseInt(getIdFromUrl(item.url)),
          }));

        results.push(...fetchedItems);

        remainingItems -= fetchedItems.length;
        skip += fetchedItems.length;

        if (fetchedItems.length === 0) {
          break;
        }
      }
    }

    const apiResponse: FormattedApiResponse<T> = {
      results,
      take,
      skip,
      total: resourceTotalNumber,
    };

    return apiResponse;
  }

  async getById(id: number): Promise<T> {
    return await firstValueFrom(
      this.httpService
        .get<any>(`${this.swapiUrl}/${this.entityName}/${id}`)
        .pipe(
          map((axiosResponse) => {
            const formattedResponse: T & TimestampsAndIdentifier = {
              ...axiosResponse.data,
              id: parseInt(getIdFromUrl(axiosResponse.data.url)),
            };
            return formattedResponse;
          }),
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw `An error happened while fetching ${this.entityName}!`;
          }),
        ),
    );
  }
}
