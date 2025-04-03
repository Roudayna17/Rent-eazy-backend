import { Characteristic } from "src/characteristic/entities/characteristic.entity";
import { Equipment } from "src/equipement/entities/equipement.entity";
import { Picture } from "src/pictures/entities/picture.entity";
export class CreateHouseDto {
  title: string;
  description: string;
  type: string;
  address: string;
  city: string;
  poste_code: number;
  price: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  lessorId: number;
  latitude: number;
  longitude: number;
  pictures: Picture[];
// Dans CreateHouseDto et UpdateHouseDto
Equipment?: { equipementId: number; quantite: number }[];
 characteristics?: { characteristicId: number; quantite: number }[];
  created_by: number;
}