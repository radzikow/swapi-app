import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Film } from '../../films/entities/film.entity';
import { Pagination } from '../../common/entity/pagination.entity';

@ObjectType()
export class Species extends Pagination {
  @Field(() => Int, { description: 'Identity number' })
  id: number;

  @Field({ description: 'Species name' })
  name: string;

  @Field({ description: 'Species classification' })
  classification: string;

  @Field({ description: 'Species designation' })
  designation: string;

  @Field({ description: 'Species average height' })
  average_height: string;

  @Field({ description: 'Species skin colors' })
  skin_colors: string;

  @Field({ description: 'Species hair colors' })
  hair_colors: string;

  @Field({ description: 'Species eye colors' })
  eye_colors: string;

  @Field({ description: 'Species average lifespan' })
  average_lifespan: string;

  @Field({ description: 'Species homeworld api url' })
  homeworld: string;

  @Field({ description: 'Species language' })
  language: string;

  @Field(() => [Film], {
    description: 'List of films',
    nullable: 'items',
  })
  films: Film[];
}
