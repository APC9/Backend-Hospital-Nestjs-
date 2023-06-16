import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { Model, isValidObjectId } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';

import { CreateUserDto, UpdateAuthDto, LoginUserDto} from './dto';
import { PaginationDto } from '../Common/dto/pagination.dto';
import { JwtPayload, LoginResponse } from '../interfaces'; 



@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectModel( User.name )
    private userModel: Model<User>,

    private readonly jwtService: JwtService,
  ){}

  async googleLogin(req) {
    const { email, name, img } = req.user  

    try {
      
      const userDB = await this.userModel.findOne({email});
      let user:User;
  
      if(!userDB){
        user = new this.userModel({
          name,
          email,
          password: '@@@@@@@@@',
          img,
          google: true,
          roles: ['user'],
          isActive: true
        })
      }else {
        user = userDB;
        user.google = true;
      }
  
      //Guardar en BD
      await user.save();
  
      return {
        user,
        token: this.getJwtToken({ id: user._id})
      };
    } catch (error) {
      this.handleExceptions(error)
    }
 
  }

  async create(createUserDto: CreateUserDto) {
    try {
      
      const { password, ...userData} = createUserDto;

      const user = new this.userModel({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      })

      await user.save();
      const { password:_, ...newUser } = user.toJSON();

      return {
        newUser,
        token: this.getJwtToken({ id: newUser._id})
      };

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAllUser(paginationDto:PaginationDto):Promise<User[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.userModel.find({isActive: true})
      .limit(limit)
      .skip(offset)
      .sort({ no: 1}) // ordena de forma ascendente la columna no:
      .select('-__v') // no muestra la propiedad __v en el objeto 
  }

  async findOne(term:string):Promise<User>  {
   
    let user: User;
    const regex = new RegExp(term.replace(/\s+/g, '\\s*'), 'i');
    //Buscar por nombre
    user = await this.userModel.findOne({ name: regex });

    // Buscar por MongoID
    if ( !user && isValidObjectId( term ) ) {
      user = await this.userModel.findById( term );
    }

    if ( !user ) 
      throw new NotFoundException(`User with id, name or no "${ term }" not found`);

    return user;
  }

  async login(loginUserDto: LoginUserDto):Promise<LoginResponse>{

    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email })

    if (!user ){
      throw new UnauthorizedException('Invalid user credentials');
    }

    if ( !bcrypt.compareSync(password, user.password) ) {
      throw new UnauthorizedException('Invalid user credentials');
    }

    const { password:_, ...rest  } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }

  }


  async update(id: string, updateAuthDto: UpdateAuthDto) {
    //const user = await this.userModel.findOne({_id: id, isActive: true})
    const user = await this.userModel.findOne({_id: id })
  
    try {
      if(!user){
        throw new NotFoundException(`User #${id} not found`);
      }
      
      const { password, ...rest } = updateAuthDto;

      await user.updateOne(rest)
      return { ...user.toJSON, ...rest}

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    const user = await this.userModel.findOne({_id: id, isActive: true})
    if(!user){
      throw new NotFoundException(`User #${id} not found`);
    }

    await user.updateOne({ isActive: false})
    return 'User deleted successfully.'
  }

  getJwtToken(payload:JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  handleExceptions(error:any):never {
    //error en consola con el formato de Nestjs
    if ( error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpeced error, check server logs');
  }

}
