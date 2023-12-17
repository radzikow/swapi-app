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
import { GenericEntityResolver } from '../../shared/generic-entity.resolver';
import { QueryName, Resource } from '../../common/enums/resource.enum';
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

  @Query(() => [Film], { name: QueryName.Films })
  async getFilms(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Film[]> {
    const cacheKey = `${QueryName.Films}:${search}:${skip}:${take}`;
    const cachedData = await this.cacheService.get<Film[]>(cacheKey);

    if (cachedData) {
      return cachedData as unknown as Film[];
    }

    const { results } = await this.filmsService.getAll(search, skip, take);
    await this.cacheService.set(cacheKey, results, this.cacheTtlSeconds);

    return results;
  }

  @Query(() => Film, { name: QueryName.Film })
  async getFilmById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Film> {
    const cacheKey = `${QueryName.Film}:${id}`;
    const cachedData = await this.cacheService.get<Film>(cacheKey);

    if (cachedData) {
      return cachedData as unknown as Film;
    }

    const data = await this.filmsService.getById(id);
    await this.cacheService.set(cacheKey, data, this.cacheTtlSeconds);

    return data;
  }

  @ResolveField(() => [Species], { name: QueryName.Species })
  async species(@Parent() film: Film): Promise<Species[]> {
    return this.resolveEntities<Species>(
      film.species as unknown as string[],
      this.speciesService.getById.bind(this.speciesService),
    );
  }

  @Query(() => [WordOccurrence], { name: QueryName.UniqueWords })
  async getUniqueWordsInOpeningCrawls(): Promise<WordOccurrence[]> {
    const cacheKey = `${QueryName.UniqueWords}`;
    const cachedData = await this.cacheService.get<WordOccurrence[]>(cacheKey);

    if (cachedData) {
      return cachedData as unknown as WordOccurrence[];
    }

    const openingCrawls = await this.filmsService.getOpeningCrawls();
    const uniqueWords =
      getUniqueWordsWithOccurrencesFromOpeningCrawls(openingCrawls);

    await this.cacheService.set(cacheKey, uniqueWords, this.cacheTtlSeconds);

    return uniqueWords;
  }

  @Query(() => [CharacterOccurrence], {
    name: QueryName.MostFrequentCharacterNames,
  })
  async getMostFrequentCharacterNamesInOpeningCrawls(): Promise<
    CharacterOccurrence[]
  > {
    const cacheKey = `${QueryName.MostFrequentCharacterNames}`;
    const cachedData =
      await this.cacheService.get<CharacterOccurrence[]>(cacheKey);

    if (cachedData) {
      return cachedData as unknown as CharacterOccurrence[];
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

    await this.cacheService.set(
      cacheKey,
      mostFrequentNames,
      this.cacheTtlSeconds,
    );

    return mostFrequentNames;
  }
}
