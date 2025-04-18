import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Put, Query } from '@nestjs/common';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { House } from './entities/house.entity';

@Controller('house')
export class HouseController {
    constructor(private readonly houseService: HouseService) {}

    @Post('create-house')
    async create(@Body() createHouseDto: CreateHouseDto) {
        try {
            const result = await this.houseService.create(createHouseDto);
            return result;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('list-house')
    async findAll() {
        try {
            return await this.houseService.findAll();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('detail-house/:id')
    async findOne(@Param('id') id: string) {
        try {
            const house = await this.houseService.findOne(+id);
            if (!house) {
                throw new HttpException('House not found', HttpStatus.NOT_FOUND);
            }
            return house;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put('update-house/:id')
    async update(@Param('id') id: string, @Body() updateHouseDto: UpdateHouseDto) {
        try {
            return await this.houseService.update(+id, updateHouseDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('delete-house/:id')
    async remove(@Param('id') id: string) {
        try {
            return await this.houseService.delete(+id);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('delete-multiple')
async deleteMultipleHouses(@Body() body: { ids: number[] }) {
  try {
    if (!body.ids || !Array.isArray(body.ids)) {
      throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
    }
    return await this.houseService.removeMultiple(body.ids);
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
    @Get('filter/price')
    async getHousesByPriceRange(
        @Query('min') minPrice: number,
        @Query('max') maxPrice: number
    ) {
        try {
            return await this.houseService.findByPriceRange(minPrice, maxPrice);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('analytics/lessor-stats')
    async getHouseCountByLessor() {
        try {
            return await this.houseService.getHousesCountByLessor();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Get('analytics/total')
async getTotalHouses() {
  try {
    const total = await this.houseService.getTotalHouseCount();
    return { total };
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
@Get('analytics/by-type')
getHouseStatisticsByType() {
  return this.houseService.getStatisticsByType();
}

}