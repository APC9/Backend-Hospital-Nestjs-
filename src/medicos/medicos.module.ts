import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';

import { MedicosService } from './medicos.service';
import { MedicosController } from './medicos.controller';
import { Medico, MedicoSchema } from './entities/medico.entity';

@Module({
  controllers: [MedicosController],
  providers: [MedicosService],
  imports: [
    ConfigModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Medico.name,
        schema: MedicoSchema
      }
    ]),
  ],
  exports:[MedicosService]
})
export class MedicosModule {}
