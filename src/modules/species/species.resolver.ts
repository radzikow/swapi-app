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
import { getIdFromUrl } from '../../common/utilities/url.utility';
import { FilmsService } from '../films/films.service';
import { GenericEntityResolver } from 'src/shared/generic-entity.resolver';
import { Resource } from 'src/common/enums/resource.enum';
import { CacheService } from 'src/shared/cache/cache.service';
import {
  getCachedData,
  setDataInCache,
} from 'src/common/utilities/cache.utility';

const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours

@Resolver(() => Species)
export class SpeciesResolver extends GenericEntityResolver {
  constructor(
    private readonly speciesService: SpeciesService,
    private readonly filmsService: FilmsService,
    protected readonly cacheService: CacheService,
  ) {
    super(Resource.Species);
  }

  @Query(() => [Species], { name: 'species' })
  async getSpecies(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Species[]> {
    const cacheKey = `species:${search}:${skip}:${take}`;

    const cachedData = await getCachedData<Species[]>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const { results: data } = await this.speciesService.getAll(
      search,
      skip,
      take,
    );

    await setDataInCache(
      this.cacheService,
      this.logger,
      cacheKey,
      data,
      CACHE_TTL_SECONDS,
    );

    return data;
  }

  @Query(() => Species, { name: 'specie' })
  async getSpeciesById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Species> {
    const cacheKey = `specie:${id}`;
    const cachedData = await getCachedData<Species>(
      this.cacheService,
      this.logger,
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const data = await this.speciesService.getById(id);

    await setDataInCache(
      this.cacheService,
      this.logger,
      cacheKey,
      data,
      CACHE_TTL_SECONDS,
    );

    return data;
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
