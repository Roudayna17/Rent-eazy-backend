import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';

import { Picture } from './entities/picture.entity';
import { PicturesController } from './pictures.controller';
import { PicturesService } from './pictures.service';

@Module({
  imports: [TypeOrmModule.forFeature([Picture])],
  controllers: [PicturesController],
  providers: [PicturesService],
  exports: [PicturesService, TypeOrmModule] // Important: exporter TypeOrmModule

})
export class PicturesModule { }
