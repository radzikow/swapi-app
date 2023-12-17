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
import { QueryName, Resource } from '../../common/enums/resource.enum';
import {
  getCachedData,
  setDataInCache,
} from '../../common/utilities/cache.utility';
import { GenericEntityResolver } from '../../shared/generic-entity.resolver';
import { ConfigService } from '@nestjs/config';

@Resolver(() => Planet)
export class PlanetsResolver extends GenericEntityResolver {
  constructor(
    protected readonly configService: ConfigService,
    private readonly planetsService: PlanetsService,
    private readonly filmsService: FilmsService,
    private readonly cacheService: CacheService,
  ) {
    super(configService, Resource.Planets);
  }

  @Query(() => [Planet], { name: QueryName.Planets })
  async getPlanets(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Planet[]> {
    const cacheKey = `${QueryName.Planets}:${search}:${skip}:${take}`;
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

  @Query(() => Planet, { name: QueryName.Planet })
  async getPlanetById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Planet> {
    const cacheKey = `${QueryName.Planet}:${id}`;
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

  @ResolveField(() => [Film], { name: QueryName.Films })
  async films(@Parent() planet: Planet): Promise<Film[]> {
    return this.resolveEntities<Film>(
      planet.films as unknown as string[],
      this.filmsService.getById.bind(this.filmsService),
    );
  }
}
