import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Species } from '../../species/entities/species.entity';
import { Planet } from '../../planets/entities/planet.entity';

@ObjectType()
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

  @Field(() => [Planet], {
    description: 'List of planets',
    nullable: 'items',
  })
  planets: Planet[];

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
