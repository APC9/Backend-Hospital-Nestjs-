import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard as AuthGuardGoogle } from '@nestjs/passport';

import { PaginationDto } from '../Common/dto/pagination.dto';
import { CreateUserDto, UpdateAuthDto, LoginUserDto, LoginGoogleDto } from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth/auth.guard';

import { LoginResponse } from '../interfaces/loginResponse.interface ';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleSingIn(@Body() loginGoogleDto:LoginGoogleDto){
    return await this.authService.googleLogin(loginGoogleDto)
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
  @Get('search-by/:term')
  findOne(@Param('term') term: string) {
    return this.authService.findOne(term);
  }

  @UseGuards( AuthGuard )
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return await this.authService.update(id, updateAuthDto);
  }

  @UseGuards( AuthGuard )
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


   /*  @Get('google')
  @UseGuards( AuthGuardGoogle('google') )
  async googleAuth(@Request() req) {}

  @Get('google-redirect')
  @UseGuards( AuthGuardGoogle('google'))
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }   */
}
