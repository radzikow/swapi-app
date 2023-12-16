import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Film } from '../../films/entities/film.entity';
import { Pagination } from '../../../common/entity/pagination.entity';
import { People } from '../../people/entities/people.entity';

@ObjectType()
export class Planet extends Pagination {
  @Field(() => Int, { description: 'Identity number' })
  id: number;

  @Field({ description: 'Planet name' })
  name: string;

  @Field({ description: 'Planet rotation period' })
  rotation_period: string;

  @Field({ description: 'Planet orbital period' })
  orbital_period: string;

  @Field({ description: 'Planet diameter' })
  diameter: string;

  @Field({ description: 'Planet climate' })
  climate: string;

  @Field({ description: 'Planet gravity' })
  gravity: string;

  @Field({ description: 'Planet terrain' })
  terrain: string;

  @Field({ description: 'Planet surface water' })
  surface_water: string;

  @Field({ description: 'Planet population' })
  population: string;

  @Field(() => [People], {
    description: 'List of residents',
    nullable: 'items',
  })
  residents: People[];

  @Field(() => [Film], {
    description: 'List of films',
    nullable: 'items',
  })
  films: Film[];
}
