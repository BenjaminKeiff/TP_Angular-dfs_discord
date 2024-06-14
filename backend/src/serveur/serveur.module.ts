import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Utilisateur,
  UtilisateurSchema,
} from 'src/utilisateur/utilisateur.schema';
import { ServeurController } from './serveur.controller';
import {
  Message,
  Salon,
  SalonSchema,
  Serveur,
  ServeurSchema,
} from './serveur.schema';
import { ServeurService } from './serveur.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Serveur.name, schema: ServeurSchema },
      { name: Utilisateur.name, schema: UtilisateurSchema },
      { name: Salon.name, schema: SalonSchema },
      { name: Message.name, schema: SalonSchema },
    ]),
  ],
  providers: [ServeurService],
  controllers: [ServeurController],
})
export class ServeurModule {}
