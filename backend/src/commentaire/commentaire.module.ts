import { Module } from '@nestjs/common';
import { CommentaireService } from './commentaire.service';
import { CommentaireController } from './commentaire.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commentaire } from './entities/commentaire.entity';

@Module({
  controllers: [CommentaireController],
  providers: [CommentaireService],
  imports: [TypeOrmModule.forFeature([Commentaire])],

})
export class CommentaireModule {}
