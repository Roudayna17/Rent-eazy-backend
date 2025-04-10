// create-commentaire.dto.ts
export class CreateCommentaireDto {
  readonly content: string;
  readonly rating: number;
  readonly houseId: number;
  readonly offreId: number; 
  readonly clientId: number;
}