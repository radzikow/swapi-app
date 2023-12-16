import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Pagination } from '../../../common/entity/pagination.entity';
import { Species } from '../../species/entities/species.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Starship } from '../../starships/entities/starship.entity';
import { Film } from '../../films/entities/film.entity';
import { Planet } from '../../planets/entities/planet.entity';

@ObjectType()
export class People extends Pagination {
  @Field(() => Int, { description: 'Identity number' })
  id: number;

  @Field({ description: 'Person name' })
  name: string;

  @Field({ description: 'Person height' })
  height: string;

  @Field({ description: 'Person mass' })
  mass: string;

  @Field({ description: 'Person hair color' })
  hair_color: string;

  @Field({ description: 'Person skin color' })
  skin_color: string;

  @Field({ description: 'Person eye color' })
  eye_color: string;

  @Field({ description: 'Person birth year' })
  birth_year: string;

  @Field({ description: 'Person gender' })
  gender: string;

  @Field({ description: 'Person homeworld (planet)' })
  homeworld: Planet;

  @Field(() => [Film], {
    description: 'List of films',
    nullable: 'items',
  })
  films: Film[];

  @Field(() => [Species], {
    description: 'List of species',
    nullable: 'items',
  })
  species: Species[];

  @Field(() => [Vehicle], {
    description: 'List of vehicles',
    nullable: 'items',
  })
  vehicles: Vehicle[];

  @Field(() => [Starship], {
    description: 'List of starships',
    nullable: 'items',
  })
  starships: Starship[];
}
