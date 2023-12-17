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
import { QueryName, Resource } from '../../common/enums/resource.enum';
import { CacheService } from '../../shared/cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Resolver(() => People)
export class PeopleResolver extends GenericEntityResolver {
  constructor(
    protected readonly configService: ConfigService,
    private readonly peopleService: PeopleService,
    private readonly filmsService: FilmsService,
    private readonly speciesService: SpeciesService,
    private readonly vehiclesService: VehiclesService,
    private readonly starshipsService: StarshipsService,
    protected readonly cacheService: CacheService,
  ) {
    super(configService, Resource.People);
  }

  @Query(() => [People], { name: QueryName.People })
  async getPeople(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<People[]> {
    const cacheKey = `${QueryName.People}:${search}:${skip}:${take}`;
    const cachedData = await this.cacheService.get<People[]>(cacheKey);

    if (cachedData) {
      return cachedData as unknown as People[];
    }

    const { results } = await this.peopleService.getAll(search, skip, take);
    await this.cacheService.set(cacheKey, results, this.cacheTtlSeconds);

    return results;
  }

  @Query(() => People, { name: QueryName.Person })
  async getPeopleById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<People> {
    const cacheKey = `${QueryName.Person}:${id}`;
    const cachedData = await this.cacheService.get<People>(cacheKey);

    if (cachedData) {
      return cachedData as unknown as People;
    }

    const data = await this.peopleService.getById(id);
    await this.cacheService.set(cacheKey, data, this.cacheTtlSeconds);

    return data;
  }

  @ResolveField(() => [Film], { name: QueryName.Films })
  async films(@Parent() people: People): Promise<Film[]> {
    return this.resolveEntities<Film>(
      people.films as unknown as string[],
      this.filmsService.getById.bind(this.filmsService),
    );
  }

  @ResolveField(() => [Species], { name: QueryName.Species })
  async species(@Parent() people: People): Promise<Species[]> {
    return this.resolveEntities<Species>(
      people.species as unknown as string[],
      this.speciesService.getById.bind(this.speciesService),
    );
  }

  @ResolveField(() => [Vehicle], { name: QueryName.Vehicles })
  async vehicles(@Parent() people: People): Promise<Vehicle[]> {
    return this.resolveEntities<Vehicle>(
      people.vehicles as unknown as string[],
      this.vehiclesService.getById.bind(this.vehiclesService),
    );
  }

  @ResolveField(() => [Starship], { name: QueryName.Starships })
  async starships(@Parent() people: People): Promise<Starship[]> {
    return this.resolveEntities<Starship>(
      people.starships as unknown as string[],
      this.starshipsService.getById.bind(this.starshipsService),
    );
  }
}
