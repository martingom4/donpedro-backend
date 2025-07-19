import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';


import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LogoutAuthDto } from './dto/logout-auth.dto';

import { UsersService } from '../users/users.service';
import { TokenService } from '../token/token.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly token: TokenService
  ){}
  async register(dto: CreateAuthDto, ip? : string) {
    const user = await this.users.create(dto);
    const payload = {sub: user.id, role: 'CLIENT'}
    const tokens  = this.token.signPair(payload)

    const decoded = this.token.verify(tokens.refreshToken); // para obtener el `exp` que es el tiempo de expiracion del token
    const expiresAt = new Date(decoded.exp * 1000);

    await this.users.saveUserToken({
      userId: user.id,
      tokenHash: tokens.refreshToken,
      createdByIp: ip,
      expiresAt,
    });

    return { user, tokens };
  }

  async login (dto: LoginAuthDto, ip?: string){
     // la autenticacion de el usuario
    const user = await this.users.userLogin(dto)
    const payload = {sub: user.id, role: 'CLIENT'}
    const tokens = this.token.signPair(payload)

    const decoded = this.token.verify<{ exp: number }>(tokens.refreshToken); // para obtener el `exp` que es el tiempo de expiracion del token
    const expiresAt = new Date(decoded.exp * 1000)

    const lastToken = await this.users.findLastToken(user.id)

    const newToken = await this.users.saveUserToken({
    userId: user.id,
    tokenHash: tokens.refreshToken,
    createdByIp: ip,
    expiresAt,
   });

   if (lastToken) {
    await this.users.revokeToken(lastToken.id);
    await this.users.markReplacedToken(lastToken.id, newToken.id);
  }

    return {
      user: { id: user.id, name: user.name, email: user.email },
      tokens,
    }
  }



  async logout(dto: LogoutAuthDto){
    const { refreshToken } = dto;
    if(!refreshToken)throw new UnauthorizedException('Refresh token is required');

    const payload = this.token.verify<{ sub: string }>(refreshToken);

    const lastToken = await this.users.findLastToken(payload.sub)
    if(!lastToken) throw new UnauthorizedException('Invalid refresh token');

    const match = await this.token.compare(refreshToken, lastToken.tokenHash);
    if(!match) throw new UnauthorizedException('Invalid refresh token');

    await this.users.revokeToken(lastToken.id);
    return { message: 'Logout successful' };

  }


  // TODOOO: Hacer el refresh token, que sea un endpoint que reciba el refresh token y devuelva un nuevo access token  para el usuario autenticado

}
