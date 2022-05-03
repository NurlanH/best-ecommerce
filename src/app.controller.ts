import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt.guard';
import {
  BuyProductDTO,
  CategoryDTO,
  ProductDTO,
  ProductIdDTO,
  SignInDTO,
  SignUpDTO,
} from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('get_all_users')
  async getAllUsers(@Query() query: any, @Res() res: Response): Promise<any> {
    const { limit, page, search } = query;
    const result = await this.appService.getAllUsers(limit, page, search);
    return res.status(200).json(result);
  }

  @Post('signup')
  async signUpUser(
    @Body() user: SignUpDTO,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.appService.signUpUser(user);
    return res.status(200).json(result);
  }

  @Post('signin')
  async signInUser(
    @Body() user: SignInDTO,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.appService.signInUser(user);
    return res.status(200).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-category')
  async createCategory(
    @Body() category: CategoryDTO,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.appService.createCategory(category);
    return res.status(200).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-product')
  async createProduct(
    @Body() product: ProductDTO,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const { authorization } = req.headers;
    const access_token = authorization.replace('Bearer', '')?.trim();
    const result = await this.appService.createProduct(product, access_token);
    return res.status(200).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('buy-product')
  async buyProduct(
    @Body() body: BuyProductDTO,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const { authorization } = req.headers;
    const access_token = authorization.replace('Bearer', '')?.trim();
 
    const result = await this.appService.buyProduct(body, access_token);
    return res.status(200).json(result);
  }
}
