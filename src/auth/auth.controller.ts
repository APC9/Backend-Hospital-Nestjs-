import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard as AuthGuardGoogle } from '@nestjs/passport';

import { CreateUserDto } from './dto/create-user.dto'; 
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from './guards/auth/auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { PaginationDto } from '../Common/dto/pagination.dto';
import { AuthService } from './auth.service';

import { LoginResponse } from '../interfaces/loginResponse.interface ';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards( AuthGuardGoogle('google') )
  async googleAuth(@Request() req) {}

  @Get('google-redirect')
  @UseGuards( AuthGuardGoogle('google'))
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }  


  @Post('create')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards( AuthGuard )
  @Get()
  findAll( @Query() paginationDto:PaginationDto) {
    return this.authService.findAllUser(paginationDto);
  }

  @UseGuards( AuthGuard )
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.authService.findOne(term);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return await this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken( @Request() req: Request ):LoginResponse {
    const user = req['user'] as User;

    return {
      user,
      token: this.authService.getJwtToken({ id: user._id })
    }
  }
}