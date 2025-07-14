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
  async register(dto: CreateAuthDto) {
    const user = await this.users.create(dto);
    const payload = {sub: user.id, role: 'CLIENT'}
    const tokens  = this.token.signPair(payload)
    return { user, tokens };
  }
}
