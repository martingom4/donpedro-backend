import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

interface JWTPayload {
  sub: string;
  role: string;
}

interface JWTPayloadExp extends JWTPayload {
  exp: number;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  private readonly accessOpts: JwtSignOptions = {
    expiresIn: '20m',
    algorithm: 'HS256',
  };

  private readonly refreshOpts: JwtSignOptions = {
    expiresIn: '30d',
    algorithm: 'HS256',
  };

  signAccessToken(payload: JWTPayload) {
    return this.jwt.sign(payload, this.accessOpts);
  }

  signRefreshToken(payload: Pick<JWTPayload, 'sub'>) {
    return this.jwt.sign(payload, this.refreshOpts);
  }

  signPair(user: JWTPayload) {
    return {
      accessToken: this.signAccessToken(user),
      refreshToken: this.signRefreshToken({ sub: user.sub }),
    };
  }
  verify<T extends object = JWTPayloadExp>(token: string): T {
    return this.jwt.verify<T>(token);
  }
  
  async compare(token: string, hash: string): Promise<boolean>{
    return bcrypt.compare(token, hash);
  }
}
