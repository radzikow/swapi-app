import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PlanetsService } from './planets.service';
import { Planet } from './entities/planet.entity';
import { Film } from '../films/entities/film.entity';
import { getIdFromUrl } from '../../common/utilities/url.utility';
import { FilmsService } from '../films/films.service';
import { CacheService } from '../../shared/cache/cache.service';
import { Logger } from '@nestjs/common';
import { Resource } from '../../common/enums/resource.enum';
import {
  getCachedData,
  setDataInCache,
} from '../../common/utilities/cache.utility';

const CACHE_TTL_SECONDS = 24 * 60 * 60;

@Resolver(() => Planet)
export class PlanetsResolver {
  private readonly logger = new Logger(Resource.Planets);

  constructor(
    private readonly planetsService: PlanetsService,
    private readonly filmsService: FilmsService,
    private readonly cacheService: CacheService,
  ) {}

  @Query(() => [Planet], { name: 'planets' })
  async getPlanets(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Planet[]> {
    const cacheKey = `planets:${search}:${skip}:${take}`;
    const cachedData = await getCachedData<Planet[]>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const { results: data } = await this.planetsService.getAll(
      search,
      skip,
      take,
    );

    await setDataInCache(
      this.cacheService,
      this.logger,
      cacheKey,
      data,
      CACHE_TTL_SECONDS,
    );

    return data;
  }

  @Query(() => Planet, { name: 'planet' })
  async getPlanetById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Planet> {
    const cacheKey = `planet:${id}`;
    const cachedData = await getCachedData<Planet>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const data = await this.planetsService.getById(id);

    await setDataInCache(
      this.cacheService,
      this.logger,
      cacheKey,
      data,
      CACHE_TTL_SECONDS,
    );

    return data;
  }

  @ResolveField(() => [Film])
  async films(@Parent() planet: Planet): Promise<Film[]> {
    const { films: filmsUrls } = planet;
    const filmsIds = filmsUrls.map((url) =>
      getIdFromUrl(url as unknown as string),
    );

    return Promise.all(
      filmsIds.map(async (id) => await this.filmsService.getById(+id)),
    );
  }
}
