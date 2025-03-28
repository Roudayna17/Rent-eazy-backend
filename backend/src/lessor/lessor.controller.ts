import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessorService } from './lessor.service';
import { CreateLessorDto } from './dto/create-lessor.dto';
import { UpdateLessorDto } from './dto/update-lessor.dto';

@Controller('lessor')
export class LessorController {
  constructor(private readonly lessorService: LessorService) {}

  @Post("create-lessor")
  create(@Body() createLessorDto: CreateLessorDto) {
    return this.lessorService.create(createLessorDto);
  }

  @Get("list-lessor")
  findAll() {
    return this.lessorService.findAll();
  }

  @Get('lessor/:id')
  findOne(@Param('id') id: string) {
    return this.lessorService.findOne(+id);
  }

  @Patch('update-lessor/:id')
  update(@Param('id') id: string, @Body() updateLessorDto: UpdateLessorDto) {
    return this.lessorService.update(+id, updateLessorDto);
  }

  @Delete('delete-lessor/:id')
  remove(@Param('id') id: string) {
    return this.lessorService.remove(+id);
  }
  @Post('delete-multiple-lessor')
  removeMultiple(@Body()lessorList:any){
    console.log("listUser",lessorList)
    this.lessorService.removeMultiple(lessorList["ids"])
  }
}
