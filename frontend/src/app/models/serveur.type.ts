import { Salon } from "./salon.type";

export declare type Serveur = {
  _id: string;
  nom: string;
  description: string;
  urlLogo: string;
  public: boolean;
  salon: Salon[];
};
