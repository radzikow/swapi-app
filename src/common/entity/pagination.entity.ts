import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class PaginationElements {
  @Field(() => Int, { description: 'Number of taken elements' })
  take: number;

  @Field(() => Int, { description: 'Number of skipped elements' })
  skip: number;

  @Field(() => Int, { description: 'Total number of available elements' })
  total: number;
}

@ObjectType()
export class Pagination {
  @Field(() => PaginationElements, { description: 'Pagination details' })
  pagination: PaginationElements;
}
