import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServeurDocument = Serveur & Document;
export type SalonDocument = Salon & Document;
export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true, minlength: 3, maxlength: 50 })
  nom: string;

  @Prop({ maxlength: 100 })
  description: string;

  @Prop()
  message: Message[];
}

@Schema()
export class Salon {
  @Prop({ required: true, minlength: 3, maxlength: 50 })
  nom: string;

  @Prop({ maxlength: 100 })
  description: string;

  @Prop()
  message: Message[];
}

@Schema()
export class Serveur {
  @Prop({ required: true, minlength: 3, maxlength: 50 })
  nom: string;

  @Prop({ maxlength: 100 })
  description: string;

  @Prop()
  urlLogo: string;

  @Prop()
  public: boolean;

  @Prop()
  salon: Salon[];
}

export const ServeurSchema = SchemaFactory.createForClass(Serveur);
export const SalonSchema = SchemaFactory.createForClass(Salon);
