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
import { FilmsService } from '../films/films.service';
import { CacheService } from '../../shared/cache/cache.service';
import { Resource } from '../../common/enums/resource.enum';
import {
  getCachedData,
  setDataInCache,
} from '../../common/utilities/cache.utility';
import { GenericEntityResolver } from '../../shared/generic-entity.resolver';
import { ConfigService } from '@nestjs/config';

@Resolver(() => Planet)
export class PlanetsResolver extends GenericEntityResolver {
  cacheTtlSeconds = this.configService.get<number>('cache.ttl_seconds');

  constructor(
    private readonly configService: ConfigService,
    private readonly planetsService: PlanetsService,
    private readonly filmsService: FilmsService,
    private readonly cacheService: CacheService,
  ) {
    super(Resource.Planets);
  }

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
      this.cacheTtlSeconds,
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
      this.cacheTtlSeconds,
    );

    return data;
  }

  @ResolveField(() => [Film], { name: 'films' })
  async films(@Parent() planet: Planet): Promise<Film[]> {
    return this.resolveEntities<Film>(
      planet.films as unknown as string[],
      this.filmsService.getById.bind(this.filmsService),
    );
  }
}
