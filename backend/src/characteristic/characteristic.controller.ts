import { Controller, Get, Post, Body, Patch, Param, Delete ,UseInterceptors,UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CharacteristicService } from './characteristic.service';
import { CreateCharacteristicDto } from './dto/create-characteristic.dto';
import { UpdateCharacteristicDto } from './dto/update-characteristic.dto';

@Controller('characteristic')
export class CharacteristicController {
  constructor(private readonly characteristicService: CharacteristicService) {}

  @Post('create-Characteristic')
  @UseInterceptors(FileInterceptor('image')) 
  create(
    @Body() createCharacteristicDto: CreateCharacteristicDto,
    @UploadedFile() file: Express.Multer.File, 
  ) {
    return this.characteristicService.create( createCharacteristicDto, file);
  }

  @Get('list-Characteristic')
  findAll() {
    return this.characteristicService.findAll();
  }

  @Get('detail-Characteristic/:id')
  findOne(@Param('id') id: number) {
    return this.characteristicService.findOne(id);
  }
  @Patch('update-Characteristic/:id')
  @UseInterceptors(FileInterceptor('image')) 
  async update(
    @Param('id') id: number,
    @Body() updateCharacteristicDto: UpdateCharacteristicDto,
    @UploadedFile() file?: Express.Multer.File, 
  ) {
    return this.characteristicService.update(id, updateCharacteristicDto, file);
  }

  @Delete('delete-Characteristic/:id')
  remove(@Param('id') id: number) {
    return this.characteristicService.remove(id);
  }
  

  @Post('delete-multiple')
  removeMultiple(@Body()characteristicList: any) {
    return this.characteristicService.removeMultiple(characteristicList.ids);
  }

}
