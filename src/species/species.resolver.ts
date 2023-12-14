import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { SpeciesService } from './species.service';
import { Species } from './entities/species.entity';

@Resolver(() => Species)
export class SpeciesResolver {
  constructor(private readonly speciesService: SpeciesService) {}

  @Query(() => [Species], { name: 'species' })
  async getSpecies(): Promise<Species[]> {
    const { results } = await this.speciesService.getSpecies();
    return results;
  }

  @Query(() => Species, { name: 'specie' })
  async getSpeciesById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Species> {
    return await this.speciesService.getSpeciesById(id);
  }
}
