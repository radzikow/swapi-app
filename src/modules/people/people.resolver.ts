import {
  Args,
  Int,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PeopleService } from './people.service';
import { People } from './entities/people.entity';
import { Film } from '../films/entities/film.entity';
import { FilmsService } from '../films/films.service';
import { Species } from '../species/entities/species.entity';
import { SpeciesService } from '../species/species.service';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { VehiclesService } from '../vehicles/vehicles.service';
import { Starship } from '../starships/entities/starship.entity';
import { StarshipsService } from '../starships/starships.service';
import { GenericEntityResolver } from '../../shared/generic-entity.resolver';
import { Resource } from '../../common/enums/resource.enum';
import { CacheService } from 'src/shared/cache/cache.service';
import {
  getCachedData,
  setDataInCache,
} from 'src/common/utilities/cache.utility';

const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

@Resolver(() => People)
export class PeopleResolver extends GenericEntityResolver {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly filmsService: FilmsService,
    private readonly speciesService: SpeciesService,
    private readonly vehiclesService: VehiclesService,
    private readonly starshipsService: StarshipsService,
    protected readonly cacheService: CacheService,
  ) {
    super(Resource.People);
  }

  @Query(() => [People], { name: 'people' })
  async getPeople(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<People[]> {
    const cacheKey = `people:${search}:${skip}:${take}`;
    const cachedData = await getCachedData<People[]>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const { results: data } = await this.peopleService.getAll(
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

  @Query(() => People, { name: 'person' })
  async getPeopleById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<People> {
    const cacheKey = `person:${id}`;
    const cachedData = await getCachedData<People>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const data = await this.peopleService.getById(id);

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
  async films(@Parent() people: People): Promise<Film[]> {
    return this.resolveEntities<Film>(
      people.films as unknown as string[],
      this.filmsService.getById.bind(this.filmsService),
    );
  }

  @ResolveField(() => [Species], { name: 'species' })
  async species(@Parent() people: People): Promise<Species[]> {
    return this.resolveEntities<Species>(
      people.species as unknown as string[],
      this.speciesService.getById.bind(this.speciesService),
    );
  }

  @ResolveField(() => [Vehicle], { name: 'vehicles' })
  async vehicles(@Parent() people: People): Promise<Vehicle[]> {
    return this.resolveEntities<Vehicle>(
      people.vehicles as unknown as string[],
      this.vehiclesService.getById.bind(this.vehiclesService),
    );
  }

  @ResolveField(() => [Starship], { name: 'starships' })
  async starships(@Parent() people: People): Promise<Starship[]> {
    return this.resolveEntities<Starship>(
      people.starships as unknown as string[],
      this.starshipsService.getById.bind(this.starshipsService),
    );
  }
}
