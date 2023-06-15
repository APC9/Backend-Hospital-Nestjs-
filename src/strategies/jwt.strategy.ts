import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';


import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';

import { User } from '../auth/entities/user.entity'; 
import { JwtPayload } from '../interfaces/jwt-payload.interface'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    
    @InjectModel( User.name )
    private userModel: Model<User>,

    configService: ConfigService

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  // Ademas de hacer las validaciones por defecto de que el JWT no haya expirado y que haga matcher
  // Con esta funcion se puede hacer otra validaciones personalizadas

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.userModel.findById({ id });

    if (!user){
      throw new UnauthorizedException('Token not valid');
    }

    if ( !user.isActive ) {
      throw new UnauthorizedException('User is inactive, talk with your administrator');
    }
  
    return user;
  }

}
