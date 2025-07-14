import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

interface JWTPayload {
  sub: string;
  role: string;
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
  verify<T extends object = JWTPayload>(token: string): T {
    return this.jwt.verify<T>(token);
  }
}
