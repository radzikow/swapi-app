import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Pagination } from '../../../common/entity/pagination.entity';
import { Species } from '../../species/entities/species.entity';
import { Planet } from '../../planets/entities/planet.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Starship } from '../../starships/entities/starship.entity';

@ObjectType()
export class Film extends Pagination {
  @Field(() => Int, { description: 'Identity number' })
  id: number;

  @Field({ description: 'Film title' })
  title: string;

  @Field(() => Int, { description: 'Episode Id)' })
  episode_id: number;

  @Field({ description: 'Film opening crawl' })
  opening_crawl: string;

  @Field({ description: 'Film director' })
  director: string;

  @Field({ description: 'Film producer' })
  producer: string;

  @Field({ description: 'Film release date' })
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
