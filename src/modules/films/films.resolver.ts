import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { FilmsService } from './films.service';
import { Film } from './entities/film.entity';
import { Species } from '../species/entities/species.entity';
import { SpeciesService } from '../species/species.service';
import { getUniqueWordsWithOccurrencesFromOpeningCrawls } from './utilities/films.utility';
import { WordOccurrence } from './entities/word-occurrence.entity';
import { CacheService } from 'src/shared/cache/cache.service';
import {
  getCachedData,
  setDataInCache,
} from 'src/common/utilities/cache.utility';
import { GenericEntityResolver } from 'src/shared/generic-entity.resolver';
import { Resource } from 'src/common/enums/resource.enum';

const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

@Resolver(() => Film)
export class FilmsResolver extends GenericEntityResolver {
  constructor(
    private readonly filmsService: FilmsService,
    private readonly speciesService: SpeciesService,
    protected readonly cacheService: CacheService,
  ) {
    super(Resource.Films);
  }

  @Query(() => [Film], { name: 'films' })
  async getFilms(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Film[]> {
    const cacheKey = `films:${search}:${skip}:${take}`;

    const cachedData = await getCachedData<Film[]>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const { results: data } = await this.filmsService.getAll(
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

  @Query(() => Film, { name: 'film' })
  async getFilmById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Film> {
    const cacheKey = `film:${id}`;

    const cachedData = await getCachedData<Film>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const data = await this.filmsService.getById(id);

    await setDataInCache(
      this.cacheService,
      this.logger,
      cacheKey,
      data,
      CACHE_TTL_SECONDS,
    );

    return data;
  }

  @ResolveField(() => [Species], { name: 'species' })
  async species(@Parent() film: Film): Promise<Species[]> {
    return this.resolveEntities<Species>(
      film.species as unknown as string[],
      this.speciesService.getById.bind(this.speciesService),
    );
  }

  @Query(() => [WordOccurrence], { name: 'uniqueWordsInOpeningCrawls' })
  async getUniqueWordsInOpeningCrawls(): Promise<WordOccurrence[]> {
    const openingCrawls = await this.filmsService.getOpeningCrawls();

    const uniqueWords =
      getUniqueWordsWithOccurrencesFromOpeningCrawls(openingCrawls);

    return uniqueWords;
  }
}
