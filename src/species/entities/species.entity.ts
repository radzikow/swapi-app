import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Species {
  @Field({ description: 'Name' })
  name: string;

  @Field({ description: 'Classification' })
  classification: string;

  @Field({ description: 'Designation' })
  designation: string;

  @Field({ description: 'Average height' })
  average_height: string;

  @Field({ description: 'List of skin colors' })
  skin_colors: string;

  @Field({ description: 'List of hair colors' })
  hair_colors: string;

  @Field({ description: 'List of eye colors' })
  eye_colors: string;

  @Field({ description: 'Average lifespan' })
  average_lifespan: string;

  @Field({ description: 'Homeworld api url' })
  homeworld: string;

  @Field({ description: 'Language' })
  language: string;

  // @Field((type) => [Film])
  // films: Film[];
}
