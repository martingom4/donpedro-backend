import { Controller, Get, Post, Body, Patch, Param, Delete, Req} from '@nestjs/common'
import {Request } from 'express'

import { AuthService } from './auth.service'
import { CreateAuthDto } from './dto/create-auth.dto'
import { LoginAuthDto } from './dto/login-auth.dto'
import { LogoutAuthDto } from './dto/logout-auth.dto'


import { UpdateAuthDto } from './dto/update-auth.dto'


//TODO me hace falta proteger las rutas de login y register con un guard de autenticacion, para que no se pueda acceder a ellas si ya se tiene un token valido

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto, @Req() req: Request) {
    return this.authService.register(createAuthDto, req.ip);
  }
  @Post('login')
  login(@Body() loginUserDto: LoginAuthDto, @Req() req: Request) {
    return this.authService.login(loginUserDto, req.ip);
  }

  @Post('logout')
  logout(@Body() logoutAuthDto: LogoutAuthDto) {
    return this.authService.logout(logoutAuthDto);
  }

}
