import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import * as dotenv from 'dotenv';

dotenv.config(); // Charger les variables d'environnement

@Injectable()
export class CloudinaryService {
  constructor() {

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    console.log('Cloudinary Config:', cloudinary.config());
  } 

  uploadImage(file: Express.Multer.File): Promise<string> {
    console.log('Fichier reçu pour Cloudinary:', file);
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error: any, result: UploadApiResponse) => {
          if (error) return reject(error);
          console.error('Erreur lors de l\'upload vers Cloudinary:', error);

          resolve(result.secure_url);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}

export interface CloudinaryResponse {
  secure_url: string;
}