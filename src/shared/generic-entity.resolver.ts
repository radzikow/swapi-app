import { Injectable, Logger } from '@nestjs/common';
import { getIdFromUrl } from '../common/utilities/url.utility';
import { ConfigService } from '@nestjs/config';
import { QueryName } from '../common/enums/resource.enum';
import { CacheService } from './cache/cache.service';

@Injectable()
export class GenericEntityResolver {
  cacheTtlSeconds: number;

  protected readonly logger = new Logger(this.entityName);

  constructor(
    protected readonly configService: ConfigService,
    protected readonly cacheService: CacheService,
    private readonly entityName: string,
  ) {
    this.cacheTtlSeconds = this.configService.get<number>('cache.ttl_seconds');
  }

  async resolveEntities<T>(
    urls: string[],
    getById: (id: number) => Promise<T>,
    resourceName: QueryName,
  ): Promise<T[]> {
    const ids = urls.map((url) => getIdFromUrl(url as unknown as string));

    const dataPromises = ids.map(async (id) => {
      try {
        const cacheKey = `${resourceName}:${id}`;
        const cachedData = await this.cacheService.get<T[]>(cacheKey);

        if (cachedData) {
          return cachedData as unknown as T[];
        }

        const promise = await getById(+id);
        await this.cacheService.set(cacheKey, promise, this.cacheTtlSeconds);

        return promise;
      } catch (error) {
        this.logger.error(
          `Error occurred while fetching entity "${this.entityName}" with ID ${id}:`,
          error.message,
        );
        return null;
      }
    });

    const data = await Promise.all(dataPromises.filter(Boolean));

    return data as unknown as T[];
  }
}
