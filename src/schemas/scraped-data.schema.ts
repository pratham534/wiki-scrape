import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ScrapedData extends Document {
  @Prop({ required: true })
  url: string;

  @Prop({ type: [Object], required: true })
  data: any[];
}

export const ScrapedDataSchema = SchemaFactory.createForClass(ScrapedData);
