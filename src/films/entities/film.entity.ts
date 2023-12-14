import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Species } from '../../species/entities/species.entity';
import { Planet } from '../../planets/entities/planet.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Starship } from '../../starships/entities/starship.entity';

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

  @Field(() => [Starship], {
    description: 'List of starships',
    nullable: 'items',
  })
  starships: Starship[];

  @Field(() => [Vehicle], {
    description: 'List of vehicles',
    nullable: 'items',
  })
  vehicles: Vehicle[];

  @Field(() => [Species], {
    description: 'List of species',
    nullable: 'items',
  })
  species: Species[];
}
