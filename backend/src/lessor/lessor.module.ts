import { Module } from '@nestjs/common';
import { LessorService } from './lessor.service';
import { LessorController } from './lessor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lessor } from './entities/lessor.entity';

@Module({
  controllers: [LessorController],
  providers: [LessorService],
   exports: [LessorService],
  imports:[TypeOrmModule.forFeature([Lessor])]
})
export class LessorModule {}

