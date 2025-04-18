import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CommentaireService } from './commentaire.service';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';

@Controller('commentaires')
export class CommentaireController {
  constructor(private readonly commentaireService: CommentaireService) {}

  @Post()
  create(@Body() createCommentaireDto: CreateCommentaireDto) {
    return this.commentaireService.create(createCommentaireDto);
  }

  @Get()
  findAll() {
    return this.commentaireService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentaireService.findOne(id);
  }

  // Nouvelle route pour les commentaires par offre
  @Get('/offre/:offreId')
  findByOffreId(@Param('offreId', ParseIntPipe) offreId: number) {
    return this.commentaireService.findByOffreId(offreId);
  }

  @Get('/average/:offreId')
  getAverageRating(@Param('offreId', ParseIntPipe) offreId: number) {
    return this.commentaireService.getAverageRatingByOffre(offreId);
  }
  @Get('analytics/statistics')
  async getCommentStatistics() {
    return this.commentaireService.getCommentStats();
  }

  @Get('analytics/house/:houseId')
  async getHouseCommentAnalytics(@Param('houseId', ParseIntPipe) houseId: number) {
    return this.commentaireService.getCommentAnalyticsByHouse(houseId);
  }

  @Get('analytics/trends')
  async getCommentTrends(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.commentaireService.getCommentStats();
  }
  @Get('recent')
getRecentComments(@Query('limit') limit = 5) {
  return this.commentaireService.getRecentComments(limit);
}

}