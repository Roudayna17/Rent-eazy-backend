import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm';
import { PictureDto } from './dto/picture.dto';
import { Picture } from './entities/picture.entity';
// const cloudinary = require('cloudinary').v2
import {v2 as cloudinary} from 'cloudinary';
          
@Injectable()
export class PicturesService {
  constructor(
    @InjectRepository(Picture)
    private readonly pictureRepository: Repository<Picture>,

  ) { }

  async findAll() {
    return await this.pictureRepository.findAndCount();
  }

  async findById(id: number): Promise<Picture> {
    let  picture= await this.pictureRepository.findOne({relations:['productId','markId'],where:{id:id}})
    return picture
   }
  

  async createPicture(createPictureDto: PictureDto) {

      cloudinary.config({ 
        cloud_name: 'dzd04po8j', 
        api_key: '417573485835699', 
        api_secret: 'uvfmjSLJDsFYOWgd-SCIGVYWo0E' 
      });
      await cloudinary.uploader.upload(createPictureDto.url,{ eager: [{ fetch_format: "auto" } ]}, function (error: any, result: any,) {
          if (result?.eager[0].url) {
            createPictureDto.url = result.eager[0].url;  
        }
      })
      console.log("image url",createPictureDto.url )
    const picture = this.pictureRepository.create({ ...createPictureDto });
    return this.pictureRepository.save(picture);
  }

  async replaceById(id: number, picture: PictureDto) {
    const picturePreload = await this.pictureRepository.preload({
      id: +id,
      ...picture,
      

    });
    if (!picturePreload) {

      throw new NotFoundException(`Picture #${id} not found`);
    }
    return this.pictureRepository.save(picturePreload);
  }

  async remove(id: number) {
    return this.pictureRepository.delete(id)
  }

  async removePictures(idsPictures: number[]) {
    idsPictures?.forEach(async id => {
      await this.remove(id)
    });
  }
}
