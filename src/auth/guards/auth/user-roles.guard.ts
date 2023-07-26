import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../../decorators/role-protected.decorator';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserRolesGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ){}

  canActivate( context: ExecutionContext): boolean {
    
     // Aqui recibimos el arreglo de roles de la metadata con la key META_ROLES
    const validRole: string[] = this.reflector.getAllAndOverride<string[]>(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

     // Aqui recibimos el usuario de la request
     const  req = context.switchToHttp().getRequest();
     const  user = req.user as User;
     const  userIdParams = req.params.id;

     // obteniendo id de los params para compararlo con el user.id y si son iguales pueda 
     // entrar a este metodo y modificarse asi mismo
     const  userID = user.id;
     const  userIdClean = userID.split("").join('') ;

    //  verificamos si tenemos el usuario y comparamos si tienen el rol valido
    if (!user)
      throw new BadRequestException('User not found');

    // si user.roles incluye el rol de administrador
    for (const role of user.roles) {
      if ( validRole.includes(role) || userIdParams === userIdClean )
        return true;
    }

    throw new BadRequestException('User does not have the required role');
  }
}
