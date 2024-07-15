import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema, Salon, SalonSchema, Serveur, ServeurSchema } from './serveur.schema';
import { ServeurController } from './serveur.controller';
import { ServeurService } from './serveur.service';
import {
  Utilisateur,
  UtilisateurSchema,
} from 'src/utilisateur/utilisateur.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Serveur.name, schema: ServeurSchema },
      { name: Utilisateur.name, schema: UtilisateurSchema },
      { name: Salon.name, schema: SalonSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [ServeurService],
  controllers: [ServeurController],
})
export class ServeurModule {}
