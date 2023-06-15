import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { HospitalModule } from 'src/hospital/hospital.module';
import { MedicosModule } from 'src/medicos/medicos.module';


@Module({
  controllers: [CloudinaryController],
  providers: [
    CloudinaryService, 
    JwtStrategy],
  imports:[
    ConfigModule,
    AuthModule,
    HospitalModule,
    MedicosModule,
    
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: '../../static/uploads',
    }),
  ],
  exports:[CloudinaryService]
})
export class CloudinaryModule {}