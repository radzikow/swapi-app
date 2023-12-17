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
import { GenericEntityResolver } from '../../shared/generic-entity.resolver';
import { ConfigService } from '@nestjs/config';
import { People } from '../people/entities/people.entity';
import { PeopleService } from '../people/people.service';

@Resolver(() => Planet)
export class PlanetsResolver extends GenericEntityResolver {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly cacheService: CacheService,
    private readonly planetsService: PlanetsService,
    private readonly filmsService: FilmsService,
    private readonly peopleService: PeopleService,
  ) {
    super(configService, cacheService, Resource.Planets);
  }

  @Query(() => [Planet], { name: QueryName.Planets })
  async getPlanets(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Planet[]> {
    const cacheKey = `${QueryName.Planets}:${search}:${skip}:${take}`;
    const cachedData = await this.cacheService.get<Planet[]>(cacheKey);

    if (cachedData) {
      return cachedData as unknown as Planet[];
    }

    const { results } = await this.planetsService.getAll(search, skip, take);
    await this.cacheService.set(cacheKey, results, this.cacheTtlSeconds);

    return results;
  }

  @Query(() => Planet, { name: QueryName.Planet })
  async getPlanetById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Planet> {
    const cacheKey = `${QueryName.Planet}:${id}`;
    const cachedData = await this.cacheService.get<Planet>(cacheKey);

    if (cachedData) {
      return cachedData as unknown as Planet;
    }

    const data = await this.planetsService.getById(id);
    await this.cacheService.set(cacheKey, data, this.cacheTtlSeconds);

    return data;
  }

  @ResolveField(() => [People], { name: 'residents' })
  async residents(@Parent() planet: Planet): Promise<People[]> {
    return this.resolveEntities<People>(
      planet.residents as unknown as string[],
      this.peopleService.getById.bind(this.peopleService),
      QueryName.Person,
    );
  }

  @ResolveField(() => [Film], { name: QueryName.Films })
  async films(@Parent() planet: Planet): Promise<Film[]> {
    return this.resolveEntities<Film>(
      planet.films as unknown as string[],
      this.filmsService.getById.bind(this.filmsService),
      QueryName.Film,
    );
  }
}
