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
import { FilmsService } from '../films/films.service';
import { GenericEntityResolver } from '../../shared/generic-entity.resolver';
import { QueryName, Resource } from '../../common/enums/resource.enum';
import { CacheService } from '../../shared/cache/cache.service';
import { ConfigService } from '@nestjs/config';

@Resolver(() => Species)
export class SpeciesResolver extends GenericEntityResolver {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly cacheService: CacheService,
    private readonly speciesService: SpeciesService,
    private readonly filmsService: FilmsService,
  ) {
    super(configService, cacheService, Resource.Species);
  }

  @Query(() => [Species], { name: QueryName.Species })
  async getSpecies(
    @Args('search', { defaultValue: '' }) search: string,
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ): Promise<Species[]> {
    const cacheKey = `${QueryName.Species}:${search}:${skip}:${take}`;
    const cachedData = await this.cacheService.get<Species[]>(cacheKey);

    if (cachedData) {
      return cachedData as unknown as Species[];
    }

    const { results } = await this.speciesService.getAll(search, skip, take);
    await this.cacheService.set(cacheKey, results, this.cacheTtlSeconds);

    return results;
  }

  @Query(() => Species, { name: QueryName.Specie })
  async getSpeciesById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Species> {
    const cacheKey = `${QueryName.Specie}:${id}`;
    const cachedData = await this.cacheService.get<Species>(cacheKey);

    if (cachedData) {
      return cachedData as unknown as Species;
    }

    const data = await this.speciesService.getById(id);
    await this.cacheService.set(cacheKey, data, this.cacheTtlSeconds);

    return data;
  }

  @ResolveField(() => [Film], { name: QueryName.Films })
  async films(@Parent() species: Species): Promise<Film[]> {
    return this.resolveEntities<Film>(
      species.films as unknown as string[],
      this.filmsService.getById.bind(this.filmsService),
      QueryName.Film,
    );
  }
}
