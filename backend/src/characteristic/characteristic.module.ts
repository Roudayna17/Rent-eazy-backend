import { Module } from '@nestjs/common';
import { CharacteristicService } from './characteristic.service';
import { CharacteristicController } from './characteristic.controller';
import { Characteristic } from './entities/characteristic.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/user/constants';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
@Module({
  controllers: [CharacteristicController],
  providers: [CharacteristicService],
   imports: [TypeOrmModule.forFeature([Characteristic]),
    
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600000000000000000s' },
    }),CloudinaryModule],
    exports:  [CharacteristicService,TypeOrmModule]

})
export class CharacteristicModule {}
