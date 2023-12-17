import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './entities/vehicle.entity';
import { FilmsService } from '../films/films.service';
import { Film } from '../films/entities/film.entity';
import { GenericEntityResolver } from '../../shared/generic-entity.resolver';
import { QueryName, Resource } from '../../common/enums/resource.enum';
import { CacheService } from '../../shared/cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Resolver(() => Vehicle)
export class VehiclesResolver extends GenericEntityResolver {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly cacheService: CacheService,
    private readonly vehiclesService: VehiclesService,
    private readonly filmsService: FilmsService,
  ) {
    super(configService, cacheService, Resource.Vehicles);
  }

  @Query(() => [Vehicle], {
    name: QueryName.Vehicles,
    description: 'Get all vehicles',
  })
  async getVehicles(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 })
    skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Vehicle[]> {
    const cacheKey = `${QueryName.Vehicles}:${search}:${skip}:${take}`;
    const cachedData = await this.cacheService.get<Vehicle[]>(cacheKey);

    if (cachedData) {
      return cachedData as unknown as Vehicle[];
    }

    const { results } = await this.vehiclesService.getAll(search, skip, take);
    await this.cacheService.set(cacheKey, results, this.cacheTtlSeconds);

    return results;
  }

  @Query(() => Vehicle, {
    name: QueryName.Vehicle,
    description: 'Get vehicle by id',
  })
  async getVehicleById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Vehicle> {
    const cacheKey = `${QueryName.Vehicle}:${id}`;
    const cachedData = await this.cacheService.get<Vehicle>(cacheKey);

    if (cachedData) {
      return cachedData as unknown as Vehicle;
    }

    const data = this.vehiclesService.getById(id);
    await this.cacheService.set(cacheKey, data, this.cacheTtlSeconds);

    return data;
  }

  @ResolveField(() => [Film], { name: QueryName.Films })
  async films(@Parent() vehicle: Vehicle): Promise<Film[]> {
    return this.resolveEntities<Film>(
      vehicle.films as unknown as string[],
      this.filmsService.getById.bind(this.filmsService),
      QueryName.Film,
    );
  }
}
