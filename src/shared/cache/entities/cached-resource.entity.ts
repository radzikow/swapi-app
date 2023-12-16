import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CachedResource extends Document {
  @Prop({ unique: true })
  key: string;

  @Prop()
  value: string;

  @Prop({ type: Date })
  expiresAt: Date;
}

export const CachedResourceSchema =
  SchemaFactory.createForClass(CachedResource);
