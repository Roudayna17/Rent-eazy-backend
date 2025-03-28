import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService], // Permet d'utiliser ce service ailleurs dans l'application
})
export class CloudinaryModule {}
