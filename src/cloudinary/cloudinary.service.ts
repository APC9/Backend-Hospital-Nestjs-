import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { v2 as cloudinary } from 'cloudinary'; 
import { v4 as uuid } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { HospitalService } from '../hospital/hospital.service';
import { MedicosService } from '../medicos/medicos.service';
import { TypeUpload } from '../interfaces/upload.enum';


@Injectable()
export class CloudinaryService {
  
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private hospitalService: HospitalService,
    private medicosService: MedicosService
  ) {

    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    })

  }

  //  yarn add @types/multer para solucionar error en => Express.Multer.File
  async uploadImage(term: string, id: string, file: Express.Multer.File): Promise<string> {

    if (!file){
      throw new BadRequestException('the file is empty')
    }

    switch (term) {

      case TypeUpload.medico:
        const  medico = await this.medicosService.findOne(id)
      return this.uploadImageCases( term, medico, file)

      case TypeUpload.user:
        const  user = await this.authService.findOne(id)
      return this.uploadImageCases( term, user, file)

      case TypeUpload.hospital:
        const  hospital = await this.hospitalService.findOne(id)
      return this.uploadImageCases( term, hospital, file)
  
    }
  }  

  private async uploadImageCases(term: string, anyCase: any, file: Express.Multer.File){
    if (!anyCase ){
      return `${anyCase} not found`
    }

    const resul = await cloudinary.uploader.upload(file.path, { 
      public_id: `${term}/${ uuid() }`
    });

    anyCase.img = resul.secure_url;
    await anyCase.updateOne(anyCase)

  return resul.secure_url;
  }


  async getImageUrl(term:string, id: string):Promise<string> {
    const url = cloudinary.url(`${term}/${id}`);
    const existImage = await this.checkCloudinaryId(url);

    return existImage ? url: 'https://res.cloudinary.com/dybfsyxq9/image/upload/v1686847866/no-image_zio7qg.jpg';
  }

  private async checkCloudinaryId(url:string){
    try {
      const img = await fetch(url)
      
      if( img.status === 200)
        return true;

      return false; 

    } catch (error) {
      console.log(error)
    }
  }

}