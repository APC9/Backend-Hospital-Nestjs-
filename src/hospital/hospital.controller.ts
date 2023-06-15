import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';

import { HospitalService } from './hospital.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { AuthGuard } from '../auth/guards/auth/auth.guard';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../Common/dto/pagination.dto';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @UseGuards( AuthGuard )
  @Post()
  create(@Body() createHospitalDto: CreateHospitalDto, @Request() req: Request) { 
    const user = req['user'] as User
    return this.hospitalService.create(createHospitalDto, user );
  }

  @Get()
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.hospitalService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.hospitalService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHospitalDto: UpdateHospitalDto) {
    return this.hospitalService.update(+id, updateHospitalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hospitalService.remove(+id);
  }
}
