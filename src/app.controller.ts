import {Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @UseGuards(JwtAuthenticationGuard)
  // @Get()
  // getHello() {
  //   return this.appService.getHello();
  // }

  // @Post('register')
  // @UsePipes(new ValidationPipe())
  // create(@Body() createUserDto: CreateUserDto) {
  //   console.log(createUserDto);
  //   return null;
  // }
}
