// src/cats/cats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Utilisateur,
  UtilisateurDocument,
} from 'src/utilisateur/utilisateur.schema';
import { Salon, Serveur, ServeurDocument } from './serveur.schema';

@Injectable()
export class ServeurService {
  constructor(
    @InjectModel(Serveur.name) private serveurModel: Model<ServeurDocument>,
    @InjectModel(Salon.name) private salonModel: Model<ServeurDocument>,
    @InjectModel(Utilisateur.name)
    private utilisateurModel: Model<UtilisateurDocument>,
  ) {}

  async create(createdServeurDto: any): Promise<Serveur> {
    const createdServeur = new this.serveurModel(createdServeurDto);
    return createdServeur.save();
  }

  async findAllPublic(): Promise<Serveur[]> {
    return this.serveurModel.find({ public: true });
  }

  async findServer(id: string): Promise<Serveur> {
    const serveur = await this.serveurModel.findOne({
      _id: id,
    });
    return serveur;
  }

  async findAllServerOfUser(email: string): Promise<Serveur[]> {
    const utilisateur = await this.utilisateurModel.findOne({ email });

    const serveurs = await this.serveurModel.find({
      _id: { $in: utilisateur.serveurs },
    });
    return serveurs;
  }

  async findAllSalonOfServer(id: string): Promise<Salon[]> {
    const server = await this.serveurModel.findOne({ id });
    return server.salon;
  }

  async addSalonToServer(
    serverId: string,
    createSalonDto: any,
  ): Promise<Serveur> {
    const server = await this.serveurModel.findById(serverId).exec();
    const newSalon = new this.salonModel(createSalonDto);
    await newSalon.save();
    server.salon.push(newSalon);
    return server.save();
  }
}
