import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { StarshipsService } from './starships.service';
import { FilmsService } from '../films/films.service';
import { Starship } from './entities/starship.entity';
import { Film } from '../films/entities/film.entity';
import { getIdFromUrl } from '../common/utilities/get-id-from-url.utility';

@Resolver(() => Starship)
export class StarshipsResolver {
  constructor(
    private readonly starshipsService: StarshipsService,
    private readonly filmsService: FilmsService,
  ) {}

  @Query(() => [Starship], { name: 'starships' })
  async getStarships(): Promise<Starship[]> {
    const { results } = await this.starshipsService.getStarships();
    return results;
  }

  @Query(() => Starship, { name: 'starship' })
  async getStarshipById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Starship> {
    return this.starshipsService.getStarshipById(id);
  }

  @ResolveField(() => [Film])
  async films(@Parent() starship: Starship): Promise<Film[]> {
    const { films: filmsUrls } = starship;
    const filmsIds = filmsUrls.map((url) =>
      getIdFromUrl(url as unknown as string),
    );

    return Promise.all(
      filmsIds.map(async (id) => await this.filmsService.getById(+id)),
    );
  }
}
