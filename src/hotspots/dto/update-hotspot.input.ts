import { CreateHotspotInput } from './create-hotspot.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateHotspotInput extends PartialType(CreateHotspotInput) {
  @Field(() => Int)
  id: number;
}
