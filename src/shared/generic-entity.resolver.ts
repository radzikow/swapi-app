import { Injectable, Logger } from '@nestjs/common';
import { getIdFromUrl } from '../common/utilities/url.utility';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenericEntityResolver {
  cacheTtlSeconds: number;

  protected readonly logger = new Logger(this.entityName);

  constructor(
    protected readonly configService: ConfigService,
    private readonly entityName: string,
  ) {
    this.cacheTtlSeconds = this.configService.get<number>('cache.ttl_seconds');
  }

  async resolveEntities<T>(
    urls: string[],
    getById: (id: number) => Promise<T>,
  ): Promise<T[]> {
    const ids = urls.map((url) => getIdFromUrl(url as unknown as string));

    const promises = ids.map(async (id) => {
      try {
        return await getById(+id);
      } catch (error) {
        this.logger.error(
          `Error occurred while fetching entity "${this.entityName}" with ID ${id}:`,
          error.message,
        );
        return null;
      }
    });

    return Promise.all(promises);
  }
}
