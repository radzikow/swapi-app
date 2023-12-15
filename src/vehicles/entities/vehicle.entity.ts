import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Film } from '../../films/entities/film.entity';
import { Pagination } from '../../common/entity/pagination.entity';

@ObjectType()
export class Vehicle extends Pagination {
  @Field(() => Int, { description: 'Identity number' })
  id: number;

  @Field({ description: 'Vehicle name' })
  name: string;

  @Field({ description: 'Vehicle model' })
  model: string;

  @Field({ description: 'Vehicle manufacturer' })
  manufacturer: string;

  @Field({ description: 'Vehicle cost in credits' })
  cost_in_credits: string;

  @Field({ description: 'Vehicle length' })
  length: string;

  @Field({ description: 'Vehicle max atmosphering speed' })
  max_atmosphering_speed: string;

  @Field({ description: 'Vehicle crew number' })
  crew: string;

  @Field({ description: 'Vehicle passengers number' })
  passengers: string;

  @Field({ description: 'Vehicle cargo capacity' })
  cargo_capacity: string;

  @Field({ description: 'Vehicle consumables' })
  consumables: string;

  @Field({ description: 'Vehicle class' })
  vehicle_class: string;

  @Field(() => [Film], {
    description: 'List of films',
    nullable: 'items',
  })
  films: Film[];
}
