import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import {PrismaService} from '../prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';


@Module({
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
