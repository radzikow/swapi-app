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
import { Resource } from '../../common/enums/resource.enum';
import { CacheService } from '../../shared/cache/cache.service';
import {
  getCachedData,
  setDataInCache,
} from '../../common/utilities/cache.utility';
import { ConfigService } from '@nestjs/config';

@Resolver(() => Vehicle)
export class VehiclesResolver extends GenericEntityResolver {
  cacheTtlSeconds = this.configService.get<number>('cache.ttl_seconds');

  constructor(
    private readonly configService: ConfigService,
    private readonly vehiclesService: VehiclesService,
    private readonly filmsService: FilmsService,
    protected readonly cacheService: CacheService,
  ) {
    super(Resource.Vehicles);
  }

  @Query(() => [Vehicle], { name: 'vehicles' })
  async getVehicles(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 })
    skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Vehicle[]> {
    const cacheKey = `vehicles:${search}:${skip}:${take}`;
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

  @Query(() => Vehicle, { name: 'vehicle' })
  async getVehicleById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Vehicle> {
    const cacheKey = `vehicle:${id}`;
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

  @ResolveField(() => [Film], { name: 'films' })
  async films(@Parent() vehicle: Vehicle): Promise<Film[]> {
    return this.resolveEntities<Film>(
      vehicle.films as unknown as string[],
      this.filmsService.getById.bind(this.filmsService),
    );
  }
}
