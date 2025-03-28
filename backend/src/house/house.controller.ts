import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';

@Controller('house')
export class HouseController {
    constructor(private readonly houseService: HouseService) {}

    @Post('create-house')
    async create(@Body() createHouseDto: CreateHouseDto) {
        console.log('Controller: Received request to create house with data:', createHouseDto);
        try {
            const result = await this.houseService.create(createHouseDto);
            console.log('Controller: House created successfully:', result);
            return result;
        } catch (error) {
            console.error('Controller: Error creating house:', error);
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
}