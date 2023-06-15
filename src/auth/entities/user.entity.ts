import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {

  @Prop({ unique: true, required: true, sparce: true})
  email: string;

  @Prop({ required: true})
  name: string;

  @Prop({ minlength: 6, required: true})
  password?: string;
  
  @Prop({ required: false})
  img?: string;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  @Prop({ default: true})
  isActive: boolean;

  @Prop({ default: false})
  google?: boolean;
  
}

export const UserSchema = SchemaFactory.createForClass( User );