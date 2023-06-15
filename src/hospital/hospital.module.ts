import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';

import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { Hospital, HospitalSchema } from './entities/hospital.entity';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  controllers: [HospitalController],
  providers: [HospitalService, JwtStrategy],
  imports: [
    AuthModule,
    ConfigModule,
    
    MongooseModule.forFeature([
      {
        name: Hospital.name,
        schema: HospitalSchema
      }
    ]),

  ],
  exports:[HospitalService]
})
export class HospitalModule {}
