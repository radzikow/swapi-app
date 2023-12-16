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
import { Resource } from 'src/common/enums/resource.enum';
import { CacheService } from 'src/shared/cache/cache.service';
import { GenericEntityResolver } from 'src/shared/generic-entity.resolver';
import {
  getCachedData,
  setDataInCache,
} from 'src/common/utilities/cache.utility';

const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

@Resolver(() => Starship)
export class StarshipsResolver extends GenericEntityResolver {
  constructor(
    private readonly starshipsService: StarshipsService,
    private readonly filmsService: FilmsService,
    protected readonly cacheService: CacheService,
  ) {
    super(Resource.Starships);
  }

  @Query(() => [Starship], { name: 'starships' })
  async getStarships(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Starship[]> {
    const cacheKey = `starships:${search}:${skip}:${take}`;
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
      CACHE_TTL_SECONDS,
    );

    return data;
  }

  @Query(() => Starship, { name: 'starship' })
  async getStarshipById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Starship> {
    const cacheKey = `starship:${id}`;
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
      CACHE_TTL_SECONDS,
    );

    return data;
  }

  @ResolveField(() => [Film], { name: 'films' })
  async films(@Parent() starship: Starship): Promise<Film[]> {
    return this.resolveEntities<Film>(
      starship.films as unknown as string[],
      this.filmsService.getById.bind(this.filmsService),
    );
  }
}
