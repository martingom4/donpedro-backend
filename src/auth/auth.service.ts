import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
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

    const decoded = this.token.verify(tokens.refreshToken); // para obtener el `exp`
    const expiresAt = new Date(decoded.exp * 1000);

    await this.users.saveUserToken({
      userId: user.id,
      tokenHash: tokens.refreshToken,
      createdByIp: ip,
      expiresAt,
    });

    return { user, tokens };
  }
}
