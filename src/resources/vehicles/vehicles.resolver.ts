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
import {
  getCachedData,
  setDataInCache,
} from '../../common/utilities/cache.utility';
import { ConfigService } from '@nestjs/config';

@Resolver(() => Vehicle)
export class VehiclesResolver extends GenericEntityResolver {
  constructor(
    protected readonly configService: ConfigService,
    private readonly vehiclesService: VehiclesService,
    private readonly filmsService: FilmsService,
    protected readonly cacheService: CacheService,
  ) {
    super(configService, Resource.Vehicles);
  }

  @Query(() => [Vehicle], { name: QueryName.Vehicles })
  async getVehicles(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 })
    skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Vehicle[]> {
    const cacheKey = `${QueryName.Vehicles}:${search}:${skip}:${take}`;
    const cachedData = await getCachedData<Vehicle[]>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const { results: data } = await this.vehiclesService.getAll(
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

  @Query(() => Vehicle, { name: QueryName.Vehicle })
  async getVehicleById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Vehicle> {
    const cacheKey = `${QueryName.Vehicle}:${id}`;
    const cachedData = await getCachedData<Vehicle>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const data = this.vehiclesService.getById(id);

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
  async films(@Parent() vehicle: Vehicle): Promise<Film[]> {
    return this.resolveEntities<Film>(
      vehicle.films as unknown as string[],
      this.filmsService.getById.bind(this.filmsService),
    );
  }
}
