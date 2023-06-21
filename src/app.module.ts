import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

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

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), // Servir contenido estatico
    }),

    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    HospitalModule,
    MedicosModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [CloudinaryService, GoogleStrategy],// no aplicar estrategia de google, solo ir al AuthService e implementar la funcionalidad
})
export class AppModule {}
