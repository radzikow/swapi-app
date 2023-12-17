import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { StarshipsService } from './starships.service';
import { FilmsService } from '../films/films.service';
import { Starship } from './entities/starship.entity';
import { Film } from '../films/entities/film.entity';
import { QueryName, Resource } from '../../common/enums/resource.enum';
import { CacheService } from '../../shared/cache/cache.service';
import { GenericEntityResolver } from '../../shared/generic-entity.resolver';
import {
  getCachedData,
  setDataInCache,
} from '../../common/utilities/cache.utility';
import { ConfigService } from '@nestjs/config';

@Resolver(() => Starship)
export class StarshipsResolver extends GenericEntityResolver {
  constructor(
    protected readonly configService: ConfigService,
    private readonly starshipsService: StarshipsService,
    private readonly filmsService: FilmsService,
    protected readonly cacheService: CacheService,
  ) {
    super(configService, Resource.Starships);
  }

  @Query(() => [Starship], { name: QueryName.Starships })
  async getStarships(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Starship[]> {
    const cacheKey = `${QueryName.Starships}:${search}:${skip}:${take}`;
    const cachedData = await getCachedData<Starship[]>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const { results: data } = await this.starshipsService.getAll(
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

  @Query(() => Starship, { name: QueryName.Starship })
  async getStarshipById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Starship> {
    const cacheKey = `${QueryName.Starship}:${id}`;
    const cachedData = await getCachedData<Starship>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const data = await this.starshipsService.getById(id);

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
  async films(@Parent() starship: Starship): Promise<Film[]> {
    return this.resolveEntities<Film>(
      starship.films as unknown as string[],
      this.filmsService.getById.bind(this.filmsService),
    );
  }
}