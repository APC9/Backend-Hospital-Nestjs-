import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { Hospital } from './entities/hospital.entity';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../Common/dto/pagination.dto';


@Injectable()
export class HospitalService {

  private readonly logger = new Logger('HospitalService');

  constructor(
    @InjectModel(Hospital.name)
    private hospitalModel: Model<Hospital>,
  ){}

  async create(createHospitalDto: CreateHospitalDto, user: User) {
    try {
      const hospital =  new this.hospitalModel({
        ...createHospitalDto,
        user: {...user}
      })
      
      await hospital.save()

      return {hospital};

    } catch (error) {
      this.handleExceptions(error)
    }
  }
  
  async findAll(paginationDto:PaginationDto):Promise<Hospital[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.hospitalModel.find()
      .populate('user', 'name')
      .limit(limit)
      .skip(offset)
      .sort({ no: 1}) // ordena de forma ascendente la columna no:
      .select('-__v') // no muestra la propiedad __v en el objeto 
  }


  async findOne(term:string):Promise<Hospital>  {
   
    let hospital: Hospital;
    const regex = new RegExp(term.replace(/\s+/g, '\\s*'), 'i');

    //Buscar por nombre
    hospital = await this.hospitalModel.findOne({ name: regex });

    // Buscar por MongoID
    if ( !hospital &&  isValidObjectId( term ) ){
      hospital = await this.hospitalModel.findById( term );
    }

    if ( !hospital ) 
      throw new NotFoundException(`Hospital with id, name or no "${ term }" not found`);

    return hospital;
  }

  async update(id: string, updateHospitalDto: UpdateHospitalDto) {
    
    const hospital = await this.hospitalModel.findOne({ _id: id });

    try {
       if (!hospital){
        throw new NotFoundException(`Hospital #${id} not found`);
       }

      await hospital.updateOne( updateHospitalDto )
      return { hospital }

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const hospital = await this.hospitalModel.findOne({_id: id, isActive: true});

    if( !hospital ){
      throw new NotFoundException(`Hospital #${id} not found`);
    }

    await hospital.updateOne({ isActive: false})
    return 'User deleted successfully.'
  }

  handleExceptions(error:any):never {
    //error en consola con el formato de Nestjs
    if ( error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpeced error, check server logs');
  }
}

