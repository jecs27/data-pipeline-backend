import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateHotspotInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
