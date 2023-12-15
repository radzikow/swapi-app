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
import { getIdFromUrl } from '../../common/utilities/get-id-from-url.utility';

@Resolver(() => Film)
export class FilmsResolver {
  constructor(
    private readonly filmsService: FilmsService,
    private readonly speciesService: SpeciesService,
  ) {}

  @Query(() => [Film], { name: 'films' })
  async getFilms(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Film[]> {
    const { results } = await this.filmsService.getAll(search, skip, take);
    return results;
  }

  @Query(() => Film, { name: 'film' })
  async getFilmById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Film> {
    return this.filmsService.getById(id);
  }

  @ResolveField(() => [Species])
  async species(@Parent() film: Film): Promise<Species[]> {
    const { species: speciesUrls } = film;
    const speciesIds = speciesUrls.map((url) =>
      getIdFromUrl(url as unknown as string),
    );

    return Promise.all(
      speciesIds.map(async (id) => await this.speciesService.getById(+id)),
    );
  }
}
