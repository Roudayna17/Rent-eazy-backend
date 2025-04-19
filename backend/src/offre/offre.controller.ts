import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, ParseIntPipe, Query } from '@nestjs/common';
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
      const offers = await this.offreService.findAll();
      // Log pour vérification
      console.log('Offers with houses:', offers.map(o => ({
        id: o.id,
        hasHouse: !!o.house,
        houseId: o.house?.id
      })));
      return offers;
    } catch (error) {
      console.error('Controller error:', error);
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
  // offre.controller.ts
@Post('delete-multiple')
async deleteMultipleOffres(@Body() body: { ids: number[] }) {
    return this.offreService.removeMultiple(body.ids);
}
  @Get('analytics/stats')
  async getOfferStatistics() {
    try {
      return await this.offreService.getOfferStatistics();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('analytics/reservations')
  async getOffersWithReservationCount() {
    try {
      return await this.offreService.getOffersWithReservationCount();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('lessor/:lessorId')
async getOffersByLessorId(@Param('lessorId', ParseIntPipe) lessorId: number) {
    try {
        return await this.offreService.findByLessorId(lessorId);
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
}
