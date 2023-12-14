import { ObjectType, Field } from '@nestjs/graphql';
import { Film } from '../../films/entities/film.entity';

@ObjectType()
export class Planet {
  @Field()
  name: string;

  @Field()
  rotation_period: string;

  @Field()
  orbital_period: string;

  @Field()
  diameter: string;

  @Field()
  climate: string;

  @Field()
  gravity: string;

  @Field()
  terrain: string;

  @Field()
  surface_water: string;

  @Field()
  population: string;

  @Field(() => [Film], {
    description: 'List of films',
    nullable: 'items',
  })
  films: Film[];
}
