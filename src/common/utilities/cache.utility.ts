import { Logger } from '@nestjs/common';
import { CacheService } from '../../shared/cache/cache.service';

export async function getCachedData<T>(
  cacheService: CacheService,
  logger: Logger,
  cacheKey: string,
): Promise<T | null> {
  try {
    const cachedData = await cacheService.get<T>(cacheKey);

    if (cachedData) {
      logger.log(`Cached data with key "${cacheKey}" successfully retrieved.`);

      return JSON.parse(cachedData.data as unknown as string);
    }
    return;
  } catch (error) {
    logger.error(`Error retrieving cached data: ${error.message}`);
  }

  return null;
}

export async function setDataInCache<T>(
  cacheService: CacheService,
  logger: Logger,
  cacheKey: string,
  data: T,
  ttl: number,
): Promise<void> {
  try {
    await cacheService.set(cacheKey, JSON.stringify(data), ttl);
  } catch (error) {
    logger.error(`Error saving data in cache: ${error.message}`);
  } finally {
    logger.log(`Data successfully saved in the cache with key "${cacheKey}".`);
  }
}
