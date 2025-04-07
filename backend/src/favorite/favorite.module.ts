import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService],
  imports:[TypeOrmModule.forFeature([Favorite])]
})
export class FavoriteModule {}
