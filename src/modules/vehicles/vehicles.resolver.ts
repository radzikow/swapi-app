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
import { getIdFromUrl } from '../../common/utilities/get-id-from-url.utility';

@Resolver(() => Vehicle)
export class VehiclesResolver {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly filmsService: FilmsService,
  ) {}

  @Query(() => [Vehicle], { name: 'vehicles' })
  async getVehicles(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Vehicle[]> {
    const { results } = await this.vehiclesService.getAll(skip, take);
    return results;
  }

  @Query(() => Vehicle, { name: 'vehicle' })
  async getVehicleById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Vehicle> {
    return this.vehiclesService.getById(id);
  }

  @ResolveField(() => [Film])
  async films(@Parent() vehicle: Vehicle): Promise<Film[]> {
    const { films: filmsUrls } = vehicle;
    const filmsIds = filmsUrls.map((url) =>
      getIdFromUrl(url as unknown as string),
    );

    return Promise.all(
      filmsIds.map(async (id) => await this.filmsService.getById(+id)),
    );
  }
}
