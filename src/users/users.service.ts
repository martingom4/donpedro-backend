import { Injectable,UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';


// importacion de los datos necesarios
import { CreateUserDto } from './dto/create-user.dto';
import { SaveUserTokenDto } from './dto/save-user-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLogin } from './dto/login-user.dto';

import { validateInputs } from '../utils/validations.inputs';
import { normalizeInputs } from '../utils/normalize.inputs';


const requieredFields = ['name', 'email', 'password']
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){} // esto lo que hace es inyectar el servicio de prisma para poder usarlo en los metodos de este servicio
  async create(createUserDto: CreateUserDto) { // async porque tiene que esparar a que se complete las opperaciones en la base de datos y en el authService
    const normalizedData = normalizeInputs(createUserDto); // normalizamos los datos de entrada es decir ANILYS quitamos los espacios en blanco y convertimos a minusculas para normalizar los datos de entrada
    // tenemos que hacer validacion de inputs

    if (!validateInputs(normalizedData, requieredFields)) { // si los datos no son validos, lanza una excepcion esto se trae desde utils/validations.inputs.ts
      throw new BadRequestException('Invalid input data');
    }
    const userExists = await this.prisma.user.findUnique({
      where:{email: normalizedData.email}
    })

    if (userExists){throw new BadRequestException('Email already exists');}
    const hash = await bcrypt.hash(normalizedData.password, 10); // encriptamos la password con bcrypt, el 10 es el numero de saltos que se le da a la password
    const user = await this.prisma.user.create({
      data: {
        name: normalizedData.name,
        email: normalizedData.email,
        passwordHash: hash,
        role: {connect: {code: 'CLIENT'}}
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })
    return user
  }
  async userLogin(loginUserDto: UserLogin){
    const normalizedData = normalizeInputs(loginUserDto)
    const fields = requieredFields.slice(1,2)// solo correo y contraseña
    if(!validateInputs(normalizedData, fields)){
      console.log(fields)
      throw new BadRequestException('Invalid input data');
    }
    const user = await this.getEmail(normalizedData.email)
    if(!user){
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(normalizedData.password, user.passwordHash) // comparamos la contraseña ingresada con la contraseña encriptada en la base de datos
    if(!isMatch){
      throw new UnauthorizedException('Invalid credentials');
    }

    return user
  }

  async saveUserToken(saveUserTokenDto: SaveUserTokenDto) {
    const hash = await bcrypt.hash(saveUserTokenDto.tokenHash, 12) // encriptamos el token con bcrypt
    return await this.prisma.userRefreshToken.create({
      data:{
        userId: saveUserTokenDto.userId,
        tokenHash: hash,
        expiresAt: saveUserTokenDto.expiresAt,
        createdByIp: saveUserTokenDto.createdByIp,
      }
    })
  }

  async getEmail(email:string){
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id:true,
        email: true,
        passwordHash: true,
      }
    })
  }


  async findLastToken(userId:string){
    return this.prisma.userRefreshToken.findFirst({ // find first porque solo queremos el ultimo token
        where:{
          userId,
          revokedAt: null, // solo queremos los tokens que no han sido revocados
        },
        orderBy:{id: 'desc'},
    })
  }
  async revokeToken(tokenId: number){
    return this.prisma.userRefreshToken.update({
      where:{id: tokenId},
      data:{revokedAt: new Date()}
    })
  }
  async markReplacedToken(oldId: number, newId: number){
    return this.prisma.userRefreshToken.update({
      where:{id: oldId},
      data:{replacedById: newId}
    })
  }









  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
