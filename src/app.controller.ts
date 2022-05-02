import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt.guard';
import { SignInDTO, SignUpDTO } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('get_all_users')
  async getAllUsers(@Query() query:any, @Res() res: Response):Promise< any> {
    const {limit, page, search} = query;
    const result = await this.appService.getAllUsers(limit, page, search);
    return res.status(200).json(result);
  }
 
  @Post('signup')
  async signUpUser(@Body() user:SignUpDTO, @Res() res: Response):Promise< any> {
    const result = await this.appService.signUpUser(user);
    return res.status(200).json(result);
  }

  @Post('signin')
  async signInUser(@Body() user:SignInDTO, @Res() res: Response):Promise< any> {
    const result = await this.appService.signInUser(user);
    return res.status(200).json(result);
  }

  @Post('product')
  async createProduct(@Body() product:any, @Res() res: Response):Promise< any> {
    const result = await this.appService.createProduct(product);
    return res.status(200).json(result);
  }
 
}
