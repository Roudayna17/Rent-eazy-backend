import { PartialType } from '@nestjs/swagger';
import { CreateEquipementDto } from './create-equipement.dto';

export class UpdateEquipementDto extends PartialType(CreateEquipementDto) {

    title?: string;
    description?: string;
    imageUrl?: string; // Nouveau champ
    condition?: string;
    quantity?: number;
    isavaible?: boolean;
    active?: boolean;
  }