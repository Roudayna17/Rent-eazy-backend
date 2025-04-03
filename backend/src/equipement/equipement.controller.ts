import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EquipementService } from './equipement.service';
import { CreateEquipementDto } from './dto/create-equipement.dto';
import { UpdateEquipementDto } from './dto/update-equipement.dto';

@Controller('Equipment')
export class EquipementController {
  constructor(private readonly equipementService: EquipementService) {}

  @Post('create-Equipment')
@UseInterceptors(FileInterceptor('image')) 
create(
  @Body() createEquipementDto: CreateEquipementDto,
  @UploadedFile() file: Express.Multer.File, 
) {
  return this.equipementService.create(createEquipementDto, file);
}
  @Get('list-Equipment')
 findAll() {
  return this.equipementService.findAll(); // La méthode findAll doit renvoyer toutes les données des équipements
}


  @Get('detail-Equipment/:id')
  findOne(@Param('id') id: number) {
    return this.equipementService.findOne(id);
  }

  @Patch('update-Equipment/:id')
  @UseInterceptors(FileInterceptor('image')) // Intercepte le fichier image
  async update(
    @Param('id') id: number,
    @Body() updateEquipementDto: UpdateEquipementDto,
    @UploadedFile() file?: Express.Multer.File, // Fichier image optionnel
  ) {
    return this.equipementService.update(id, updateEquipementDto, file);
  }

  @Delete('delete-Equipment/:id')
  remove(@Param('id') id: number) {
    return this.equipementService.remove(+id);
  }

  @Post('delete-multiple')
  removeMultiple(@Body() EquipementList: any) {
    return this.equipementService.removeMultiple(EquipementList.ids);
  }
}