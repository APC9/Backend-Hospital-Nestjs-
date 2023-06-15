import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { HospitalModule } from './hospital/hospital.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';


import { envConfiguration } from './config/env.config';
import { MedicosModule } from './medicos/medicos.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfiguration],
      //validationSchema: joiValidationSchema,
    }),

    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    HospitalModule,
    MedicosModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [CloudinaryService, GoogleStrategy],
})
export class AppModule {}
