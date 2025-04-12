import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { AuthModule } from './auth/auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { EquipementModule } from './equipement/equipement.module';
import { CharacteristicModule } from './characteristic/characteristic.module';
import { HouseModule } from './house/house.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PicturesModule } from './pictures/pictures.module';
import { LessorModule } from './lessor/lessor.module';
import { OffreModule } from './offre/offre.module';
import { ReservationModule } from './reservation/reservation.module';
import { Commentaire } from './commentaire/entities/commentaire.entity';
import { CommentaireModule } from './commentaire/commentaire.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
    useFactory: () => ({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ApiHouse',
      autoLoadEntities: true,
      synchronize: true,
        //  synchronize: false
    })}),
    ConfigModule.forRoot(),
    UserModule,
    ClientModule,
    AuthModule,
    ContactModule,
    EquipementModule,
    LessorModule,
    OffreModule,
    CharacteristicModule,
    HouseModule,
    CloudinaryModule,
    PicturesModule,ReservationModule,CommentaireModule, FeedbackModule
    
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
  
})
export class AppModule {}
