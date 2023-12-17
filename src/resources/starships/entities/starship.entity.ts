import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Film } from '../../films/entities/film.entity';
import { Pagination } from '../../../common/entity/pagination.entity';

@ObjectType()
export class Starship extends Pagination {
  @Field(() => Int, { description: 'Identity number' })
  id: number;

  @Field({ description: 'Starship name' })
  name: string;

  @Field({ description: 'Starship model' })
  model: string;

  @Field({ description: 'Starship manufacturer' })
  manufacturer: string;

  @Field({ description: 'Starship cost in credits' })
  cost_in_credits: string;

  @Field({ description: 'Starship length' })
  length: string;

  @Field({ description: 'Starship max atmosphering speed' })
  max_atmosphering_speed: string;

  @Field({ description: 'Starship crew number' })
  crew: string;

  @Field({ description: 'Starship passengers number' })
  passengers: string;

  @Field({ description: 'Starship cargo capacity' })
  cargo_capacity: string;

  @Field({ description: 'Starship consumables in years' })
  consumables: string;

  @Field({ description: 'Starship hyperdrive rating' })
  hyperdrive_rating: string;

  @Field({ description: 'Starship MGLT' })
  mglt: string;

  @Field({ description: 'Starship class' })
  starship_class: string;

  @Field(() => [Film], {
    description: 'List of films',
    nullable: 'items',
  })
  films: Film[];
}
