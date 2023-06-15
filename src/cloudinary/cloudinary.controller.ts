import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { Response } from 'express';
import { AuthGuard } from '../auth/guards/auth/auth.guard';

@Controller('cloudinary')
export class CloudinaryController {
  
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards( AuthGuard )
  @Post('upload/:term/:id')
  @UseInterceptors(FileInterceptor('img'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('term') term: string,
    @Param('id') id: string
    ): Promise<{ url: string }>{

    if (!file) {
      throw new BadRequestException('Make sure that the file is an image')
    }

    const url = await this.cloudinaryService.uploadImage(term, id, file);
    return { url };
  }

  @UseGuards( AuthGuard )
  @Get(':term/:id')
  async getImage(
    @Param('term') term: string,
    @Param('id') id: string, 
    @Res() res: Response) {
    const url = await this.cloudinaryService.getImageUrl(term, id);
    res.status(200).json({
      url
    });
  }
}