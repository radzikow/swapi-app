import { ObjectType, Field, Int } from '@nestjs/graphql';

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

  // @Field({ nullable: true, description: 'Character' })
  // characters: Character[];

  // @Field((type) => [Planet])
  // planets: Planet[];

  // @Field((type) => [Starship])
  // starships: Starship[];

  // @Field((type) => [Vehicle])
  // vehicles: Vehicle[];

  // @Field((type) => [Species])
  // species: Species[];
}
