export class CreateOffreDto {
  readonly title: string;
  readonly description: string;
  readonly houseId: number;
  readonly priceHT: number;
  readonly TVA: number;
  readonly priceTTC: number;
  readonly availability: 'Disponible' | 'Non disponible' | 'Bientôt dispo';
  readonly time?: string;
}