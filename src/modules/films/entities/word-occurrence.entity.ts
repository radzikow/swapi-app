import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WordOccurrence {
  @Field({ description: 'Unique word' })
  word: string;

  @Field(() => Int, { description: 'Unique word occurrences' })
  occurrences: number;
}
