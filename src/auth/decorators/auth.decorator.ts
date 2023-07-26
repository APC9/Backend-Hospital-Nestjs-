import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


import { RoleProtected } from './role-protected.decorator';
import { UserRolesGuard } from '../guards/auth/user-roles.guard';
import { ValidRoles } from '../../interfaces/valid-roles';


export function Auth(...roles: ValidRoles[]) {

  return applyDecorators(
    // son decoradores sin el @
    RoleProtected(...roles), // recibe un array de roles y los establece en la metadata
    UseGuards(AuthGuard(), UserRolesGuard), //recibe los roles de la metadata y los compara
  );
}