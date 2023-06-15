import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


@Schema({collection: 'Hospitales'})
export class Hospital extends Document{

  @Prop({ required: true})
  name: string;
  
  @Prop({ required: false})
  img?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
  user: mongoose.Schema.Types.ObjectId;
  
}

export const HospitalSchema = SchemaFactory.createForClass( Hospital );