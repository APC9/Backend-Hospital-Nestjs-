import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';

import { User } from 'src/auth/entities/user.entity';
import { AuthGuard } from '../auth/guards/auth/auth.guard';
import { PaginationDto } from '../Common/dto/pagination.dto';

@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @UseGuards( AuthGuard )
  @Post()
  create(@Body() createMedicoDto: CreateMedicoDto, @Request() req: Request) {
    const user = req['user'] as User
    return this.medicosService.create(createMedicoDto, user);
  }

  @Get()
  findAll( @Query() paginationDto:PaginationDto) {
    return this.medicosService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.medicosService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updateMedicoDto: UpdateMedicoDto) {
    return this.medicosService.update(term, updateMedicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicosService.remove(+id);
  }
}
