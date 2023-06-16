import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


@Schema()
export class Medico extends Document{
  @Prop({ required: true})
  name: string;
  
  @Prop({ required: false})
  img?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,})
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ default: true})
  isActive: boolean;
 
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true,})
  hospital: mongoose.Schema.Types.ObjectId;
  
}

export const MedicoSchema = SchemaFactory.createForClass( Medico );
