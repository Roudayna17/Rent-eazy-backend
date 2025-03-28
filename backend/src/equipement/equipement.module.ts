import { Module } from '@nestjs/common';
import { EquipementService } from './equipement.service';
import { EquipementController } from './equipement.controller';
import { Equipement } from './entities/equipement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { jwtConstants } from 'src/user/constants';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
@Module({
  controllers: [EquipementController],
  providers: [EquipementService],
  imports:[TypeOrmModule.forFeature([Equipement]),
   JwtModule.register({
        global: true,
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '600000000000000000s' },
      }),CloudinaryModule],
   exports: [EquipementService,TypeOrmModule],
})
export class EquipementModule {}
