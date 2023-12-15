import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { SpeciesService } from './species.service';
import { Species } from './entities/species.entity';
import { Film } from '../films/entities/film.entity';
import { getIdFromUrl } from '../../common/utilities/get-id-from-url.utility';
import { FilmsService } from '../films/films.service';

@Resolver(() => Species)
export class SpeciesResolver {
  constructor(
    private readonly speciesService: SpeciesService,
    private readonly filmsService: FilmsService,
  ) {}

  @Query(() => [Species], { name: 'species' })
  async getSpecies(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Species[]> {
    const { results } = await this.speciesService.getAll(skip, take);
    return results;
  }

  @Query(() => Species, { name: 'specie' })
  async getSpeciesById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Species> {
    return await this.speciesService.getById(id);
  }

  @ResolveField(() => [Film])
  async films(@Parent() species: Species): Promise<Film[]> {
    const { films: filmsUrls } = species;
    const filmsIds = filmsUrls.map((url) =>
      getIdFromUrl(url as unknown as string),
    );

    return Promise.all(
      filmsIds.map(async (id) => await this.filmsService.getById(+id)),
    );
  }
}
