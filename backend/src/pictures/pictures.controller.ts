import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PictureDto } from './dto/picture.dto';
import { PicturesService } from './pictures.service';

@Controller('pictures')
  
export class PicturesController {
  constructor(private readonly pictureService: PicturesService) { }
  @Get('/pictures')
  findAll() {
    return this.pictureService.findAll();
  }
  @Get('/picture/:id')
  findById(@Param('id') id: number) {
    return this.pictureService.findById(id);
  }
  @Post('/add-picture')
  createPicture(@Body() pictureDto: PictureDto,) {
    return this.pictureService.createPicture(pictureDto);
  }

  @Patch('/picture/:id')
  async replaceById(@Param('id') id: number, @Body() pictureDto: PictureDto) {
    return this.pictureService.replaceById(id, pictureDto);
  }
  @Delete('/picture/:id')
  remove(@Param('id') id: number) { 
    return this.pictureService.remove(id);
  }
  @Post('/pictures/product')
  removePictures(@Body() idsPictures: number[]) {
    return this.pictureService.removePictures(idsPictures);
  }

}
