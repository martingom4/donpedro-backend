import { Controller, Get, Post, Body, Patch, Param, Delete, Req} from '@nestjs/common'
import {Request } from 'express'
import { AuthService } from './auth.service'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto, @Req() req: Request) {
    return this.authService.register(createAuthDto, req.ip);
  }


}
