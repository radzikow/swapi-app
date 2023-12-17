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
import { Planet } from '../planets/entities/planet.entity';
import { PlanetsService } from '../planets/planets.service';
import { Starship } from '../starships/entities/starship.entity';
import { StarshipsService } from '../starships/starships.service';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { VehiclesService } from '../vehicles/vehicles.service';

@Resolver(() => Film)
export class FilmsResolver extends GenericEntityResolver {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly cacheService: CacheService,
    private readonly filmsService: FilmsService,
    private readonly speciesService: SpeciesService,
    private readonly peopleService: PeopleService,
    private readonly planetsService: PlanetsService,
    private readonly starshipsService: StarshipsService,
    private readonly vehiclesService: VehiclesService,
  ) {
    super(configService, cacheService, Resource.Films);
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

  @ResolveField(() => [Planet], { name: QueryName.Planets })
  async planets(@Parent() film: Film): Promise<Planet[]> {
    return this.resolveEntities<Planet>(
      film.planets as unknown as string[],
      this.planetsService.getById.bind(this.planetsService),
      QueryName.Planet,
    );
  }

  @ResolveField(() => [Starship], { name: QueryName.Starships })
  async starships(@Parent() film: Film): Promise<Starship[]> {
    return this.resolveEntities<Starship>(
      film.starships as unknown as string[],
      this.starshipsService.getById.bind(this.starshipsService),
      QueryName.Starship,
    );
  }

  @ResolveField(() => [Vehicle], { name: QueryName.Vehicles })
  async vehicles(@Parent() film: Film): Promise<Vehicle[]> {
    return this.resolveEntities<Vehicle>(
      film.vehicles as unknown as string[],
      this.vehiclesService.getById.bind(this.vehiclesService),
      QueryName.Vehicle,
    );
  }

  @ResolveField(() => [Species], { name: QueryName.Species })
  async species(@Parent() film: Film): Promise<Species[]> {
    return this.resolveEntities<Species>(
      film.species as unknown as string[],
      this.speciesService.getById.bind(this.speciesService),
      QueryName.Specie,
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
