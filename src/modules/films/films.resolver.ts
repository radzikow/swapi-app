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
import {
  findMostFrequentNames,
  getCharacterNamesWithOccurrencesFromOpeningCrawls,
  getUniqueWordsWithOccurrencesFromOpeningCrawls,
} from './utilities/films.utility';
import { WordOccurrence } from './entities/word-occurrence.entity';
import { CacheService } from '../../shared/cache/cache.service';
import {
  getCachedData,
  setDataInCache,
} from '../../common/utilities/cache.utility';
import { GenericEntityResolver } from '../../shared/generic-entity.resolver';
import { Resource } from '../../common/enums/resource.enum';
import { ConfigService } from '@nestjs/config';
import { PeopleService } from '../people/people.service';
import { CharacterOccurrence } from './entities/character-occurrence.entity';

@Resolver(() => Film)
export class FilmsResolver extends GenericEntityResolver {
  constructor(
    protected readonly configService: ConfigService,
    private readonly filmsService: FilmsService,
    private readonly speciesService: SpeciesService,
    private readonly peopleService: PeopleService,
    protected readonly cacheService: CacheService,
  ) {
    super(configService, Resource.Films);
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
      this.cacheTtlSeconds,
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
      this.cacheTtlSeconds,
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
    const cacheKey = `uniqueWordsInOpeningCrawls`;
    const cachedData = await getCachedData<WordOccurrence[]>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const openingCrawls = await this.filmsService.getOpeningCrawls();

    const uniqueWords =
      getUniqueWordsWithOccurrencesFromOpeningCrawls(openingCrawls);

    await setDataInCache(
      this.cacheService,
      this.logger,
      cacheKey,
      uniqueWords,
      this.cacheTtlSeconds,
    );

    return uniqueWords;
  }

  @Query(() => [CharacterOccurrence], {
    name: 'mostFrequentCharacterNamesInOpeningCrawls',
  })
  async getMostFrequentCharacterNamesInOpeningCrawls(): Promise<
    CharacterOccurrence[]
  > {
    const cacheKey = `mostFrequentCharacterNamesInOpeningCrawls`;
    const cachedData = await getCachedData<CharacterOccurrence[]>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const allCharactersNames = await this.peopleService.getCharacterNames();

    const openingCrawls = await this.filmsService.getOpeningCrawls();

    const characterNamesFromOpeningCrawls =
      getCharacterNamesWithOccurrencesFromOpeningCrawls(
        allCharactersNames,
        openingCrawls,
      );

    const mostFrequentNames = findMostFrequentNames(
      characterNamesFromOpeningCrawls,
    );

    await setDataInCache(
      this.cacheService,
      this.logger,
      cacheKey,
      mostFrequentNames,
      this.cacheTtlSeconds,
    );

    return mostFrequentNames;
  }
}
