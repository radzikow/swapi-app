import { Injectable, Logger } from '@nestjs/common';
import { getIdFromUrl } from '../common/utilities/url.utility';

@Injectable()
export class GenericEntityResolver {
  private readonly logger = new Logger(this.entityName);

  constructor(private readonly entityName: string) {}

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

  async resolveEntity<T>(
    url: string,
    getById: (id: number) => Promise<T>,
  ): Promise<T> {
    const id = getIdFromUrl(url as unknown as string);

    try {
      return await getById(+id);
    } catch (error) {
      this.logger.error(
        `Error occurred while fetching entity "${this.entityName}" with ID ${id}:`,
        error.message,
      );
      return null;
    }
  }
}
