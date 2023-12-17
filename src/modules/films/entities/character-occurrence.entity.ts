import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CharacterOccurrence {
  @Field({ description: 'Character name' })
  name: string;

  @Field(() => Int, { description: 'Character name occurrences' })
  occurrences: number;
}
