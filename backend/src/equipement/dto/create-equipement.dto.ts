export class CreateEquipementDto {
  title: string;
  description: string;
  imageUrl: string; // Nouveau champ
  condition: string;
  quantity: number;
  isavaible: boolean;
  active: boolean;
}