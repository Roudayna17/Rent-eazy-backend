export class CreateOffreDto {
  title: string;
   description: string;
   houseId: number;
   imageUrl?: string;
  priceHT: number;
  TVA: number;
  priceTTC: number;
   availability: 'Disponible' | 'Non disponible' | 'Bientôt dispo';
   time?: string;
}