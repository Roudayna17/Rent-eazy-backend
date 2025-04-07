import { Client } from "src/client/entities/client.entity";

export class CreateCommentaireDto {
    id: number;

  content: string;

  urlImage: string

  randonneeId: number ;

  clientId: Client | null; 
  
}