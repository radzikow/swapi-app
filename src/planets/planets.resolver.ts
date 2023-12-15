import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PlanetsService } from './planets.service';
import { Planet } from './entities/planet.entity';
import { Film } from '../films/entities/film.entity';
import { getIdFromUrl } from '../common/utilities/get-id-from-url.utility';
import { FilmsService } from '../films/films.service';

@Resolver(() => Planet)
export class PlanetsResolver {
  constructor(
    private readonly planetsService: PlanetsService,
    private readonly filmsService: FilmsService,
  ) {}

  @Query(() => [Planet], { name: 'planets' })
  async getFilms(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Planet[]> {
    const { results } = await this.planetsService.getPlanets(skip, take);
    return results;
  }

  @Query(() => Planet, { name: 'planet' })
  async getPlanetById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Planet> {
    return this.planetsService.getPlanetById(id);
  }

  @ResolveField(() => [Film])
  async films(@Parent() planet: Planet): Promise<Film[]> {
    const { films: filmsUrls } = planet;
    const filmsIds = filmsUrls.map((url) =>
      getIdFromUrl(url as unknown as string),
    );

    return Promise.all(
      filmsIds.map(async (id) => await this.filmsService.getFilmById(+id)),
    );
  }
}
