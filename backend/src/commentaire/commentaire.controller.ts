// commentaire.controller.ts
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

  @Get('/house/:houseId')
  findByHouseId(@Param('houseId', ParseIntPipe) houseId: number) {
    return this.commentaireService.findByHouseId(houseId);
  }

  @Get('/average/:houseId')
  getAverageRating(@Param('houseId', ParseIntPipe) houseId: number) {
    return this.commentaireService.getAverageRating(houseId);
  }
}