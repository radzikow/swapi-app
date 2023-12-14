import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { FilmsService } from './films.service';
import { Film } from './entities/film.entity';

@Resolver(() => Film)
export class FilmsResolver {
  constructor(private readonly filmsService: FilmsService) {}

  @Query(() => [Film], { name: 'films' })
  async getFilms(): Promise<Film[]> {
    const { results } = await this.filmsService.getFilms();
    return results;
  }

  @Query(() => Film, { name: 'film' })
  async getFilmById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Film> {
    return await this.filmsService.getFilmById(id);
  }
}
