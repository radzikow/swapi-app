import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Species } from '../../species/entities/species.entity';

@ObjectType({ description: 'Film' })
export class Film {
  @Field({ description: 'Title' })
  title: string;

  @Field(() => Int, { description: 'Episode ID)' })
  episode_id: number;

  @Field({ description: 'Opening crawl' })
  opening_crawl: string;

  @Field({ description: 'Director' })
  director: string;

  @Field({ description: 'Producer' })
  producer: string;

  @Field({ description: 'Release date' })
  release_date: string;

  // @Field((type) => [Planet])
  // planets: Planet[];

  // @Field((type) => [Starship])
  // starships: Starship[];

  // @Field({ description: 'List of vehicles api urls' })
  // vehicles: string[];

  @Field(() => [Species], {
    description: 'List of species',
    nullable: 'items',
  })
  species: Species[];
}
