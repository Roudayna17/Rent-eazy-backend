import { Characteristic } from "src/characteristic/entities/characteristic.entity";
import { Equipement } from "src/equipement/entities/equipement.entity";
import { Picture } from "src/pictures/entities/picture.entity";

export class CreateHouseDto {
  title: string;
  description: string;
  type: string;
  address: string; // Colonne 'location' en base
  city: string;
  poste_code: number;
  price: number;
  availability: string;
  lessorId: number;
  latitude: number;
  longitude: number;
  pictures: Picture[];
  characteristics?: Characteristic[];
  equipements?: Equipement[];
  created_by: number;  
  housedetails: any;
}