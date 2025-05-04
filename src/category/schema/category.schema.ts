import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  categoryId: string;

  @Prop({ type: [String], default: [] }) // Ensure bookIds is an array of strings
  bookIds: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
