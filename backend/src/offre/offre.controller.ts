import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { OffreService } from './offre.service';
import { CreateOffreDto } from './dto/create-offre.dto';
import { UpdateOffreDto } from './dto/update-offre.dto';

@Controller('offre')
export class OffreController {
  offreRepository: any;
  constructor(private readonly offreService: OffreService) {}

  @Post('create-offre')
  create(@Body() createOffreDto: CreateOffreDto) {
    return this.offreService.create(createOffreDto);
  }
  
  @Get('list-offre')
  async findAll() {
    try {
      return await this.offreService.findAll();
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error fetching offers',
        message: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get('detail-offre/:id')
  findOne(@Param('id') id: string) {
    return this.offreService.findOne(+id);
  }
  @Patch('update-offre/:id')
  async update(
      @Param('id') id: string,
      @Body() updateOffreDto: UpdateOffreDto
  ) {
      try {
          const numericId = parseInt(id);
          if (isNaN(numericId)) {
              throw new HttpException('ID invalide', HttpStatus.BAD_REQUEST);
          }
          
          const result = await this.offreService.update(numericId, updateOffreDto);
          if (!result) {
              throw new HttpException('Offre non trouvée', HttpStatus.NOT_FOUND);
          }
          return result;
      } catch (error) {
          throw new HttpException(
              error.message,
              HttpStatus.INTERNAL_SERVER_ERROR
          );
      }
  }

  @Delete('delete-offre/:id')
  remove(@Param('id') id: string) {
    return this.offreService.delete(+id);
  }
  @Post('delete-multiple')
  async deleteMultipleOffres(@Body() selectedOffres:any) {
  console.log('Selected houses to delete:', selectedOffres);
  return this.offreService.removeMultiple(selectedOffres);
  }
}
