import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('favorites')
@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new favorite' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The favorite has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input.',
  })
  async create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return await this.favoriteService.create(createFavoriteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all active favorites.',
  })
  async findAll() {
    return await this.favoriteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a favorite by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The favorite with the requested ID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Favorite not found.',
  })
  async findOne(@Param('id') id: number) {
    return await this.favoriteService.findOne(+id);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Get all favorites for a client' })
  @ApiParam({ name: 'clientId', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of favorites for the specified client.',
  })
  async findByClient(@Param('clientId') clientId: number) {
    return await this.favoriteService.findByClient(+clientId);
  }

  @Get('offre/:offreId')
  @ApiOperation({ summary: 'Get all favorites for an offer' })
  @ApiParam({ name: 'offreId', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of favorites for the specified offer.',
  })
  async findByOffre(@Param('offreId') offreId: number) {
    return await this.favoriteService.findByOffre(+offreId);
  }

  @Get('check-favorite')
  @ApiOperation({ summary: 'Check if an offer is favorited by a client' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Boolean indicating favorite status.',
  })
  async isFavorite(
    @Query('offreId') offreId: number,
    @Query('clientId') clientId: number,
  ) {
    return await this.favoriteService.isFavorite(+offreId, +clientId);
  }

  @Post('toggle')
  @ApiOperation({ summary: 'Toggle favorite status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The favorite status has been toggled.',
  })
  async toggleFavorite(
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return await this.favoriteService.toggleFavorite(createFavoriteDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a favorite' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The favorite has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Favorite not found.',
  })
  async update(
    @Param('id') id: number,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return await this.favoriteService.update(+id, updateFavoriteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a favorite (soft delete)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The favorite has been soft deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Favorite not found.',
  })
  async remove(@Param('id') id: number) {
    await this.favoriteService.remove(+id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Permanently delete a favorite' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The favorite has been permanently deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Favorite not found.',
  })
  async hardRemove(@Param('id') id: number) {
    await this.favoriteService.hardRemove(+id);
  }
}