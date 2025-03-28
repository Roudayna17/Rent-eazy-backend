import { PartialType } from '@nestjs/swagger';
import { CreateHouseDto } from './create-house.dto';

export class UpdateHouseDto extends PartialType(CreateHouseDto) {
  picturesToDelete?: number[]; // Pour gérer la suppression d'images
  newPictures?: string[]; // Pour ajouter de nouvelles images
}