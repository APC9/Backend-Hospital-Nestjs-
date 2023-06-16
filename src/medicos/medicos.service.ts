import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';
import { Medico } from './entities/medico.entity';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../Common/dto/pagination.dto';

@Injectable()
export class MedicosService {

  private readonly logger = new Logger('MedicosService');

  constructor(
    @InjectModel(Medico.name)
    private medicosModel: Model<Medico>,
  ){}

  async create(createMedicoDto: CreateMedicoDto, user:User):Promise<Medico> {
    try {

      const medico =  new this.medicosModel({
        ...createMedicoDto,
        user: {...user}
      })
      
      await medico.save()

      return medico;

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(paginationDto:PaginationDto):Promise<Medico[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.medicosModel.find()
      .populate('user', 'name img') // Objeto 'user':{ name, img}
      .populate('hospital', 'name') // Objeto 'hospital':{ name}
      .limit(limit)
      .skip(offset)
      .sort({ no: 1}) // ordena de forma ascendente la columna no:
      .select('-__v') // no muestra la propiedad __v en el objeto 
  }

  async findOne(term:string):Promise<Medico>  {
   
    let medico: Medico;
    const regex = new RegExp(term.replace(/\s+/g, '\\s*'), 'i');

    //Buscar por nombre
    medico = await this.medicosModel.findOne({ name: regex });

    // Buscar por MongoID
    if ( !medico && isValidObjectId( term ) ) {
      medico = await this.medicosModel.findById( term );
    }

    if ( !medico ) 
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);

    return medico;
  }

  async update(id:string, updateMedicoDto: UpdateMedicoDto) {

    const medico = await this.medicosModel.findOne({_id: id});

    try {
      if(!medico){
        throw new NotFoundException(`medico #${id} not found`);
      }
      
      await medico.updateOne(updateMedicoDto)
      return { medico }

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    const medico = await this.medicosModel.findOne({_id: id, isActive: true})
    
    if(!medico){
      throw new NotFoundException(`medico #${id} not found`);
    }

    await medico.updateOne({ isActive: false})
    return 'medico deleted successfully.'
  }

  handleExceptions(error:any):never {
    //error en consola con el formato de Nestjs
    if ( error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpeced error, check server logs');
  }
}
