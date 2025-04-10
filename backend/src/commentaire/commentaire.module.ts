// commentaire.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commentaire } from './entities/commentaire.entity';
import { CommentaireService } from './commentaire.service';
import { CommentaireController } from './commentaire.controller';
import { HouseModule } from 'src/house/house.module';
import { ClientModule } from 'src/client/client.module';
import { OffreModule } from 'src/offre/offre.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commentaire]),
    HouseModule,
    ClientModule,
    OffreModule,
  ],
  controllers: [CommentaireController],
  providers: [CommentaireService],
  exports: [CommentaireService],
})
export class CommentaireModule {}