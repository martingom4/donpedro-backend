import { Injectable,UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


// importacion de los datos necesarios
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){} // esto lo que hace es inyectar el servicio de prisma para poder usarlo en los metodos de este servicio
  async create(createUserDto: CreateUserDto) { // async porque tiene que esparar a que se complete las opperaciones en la base de datos y en el authService
    /*	1.	Recibir un DTO válido
            •	createUserDto: CreateUserDto como parámetro.
        2.	Validar existencia de email
            •	Consultar si ya existe un usuario con ese email en la base de datos.
            •	Si existe, lanzar un error (ConflictException o Error).
        3.	Crear el usuario en la base de datos
            •	Usar prisma.user.create con los datos del DTO.
            •	Aquí NO se encripta password (ya debe venir encriptado desde AuthService).
        4.	Retornar el usuario creado
            •	Sin el password por seguridad (usa select para omitirlo).
        5.Manejo de errores
            •	try/catch si quieres capturar y lanzar errores personalizados.
  */
    const userExists = await this.prisma.user.findUnique({
      where:{
        email: createUserDto.email
      }
    })
    if (userExists){
      throw new BadRequestException('Email already exists');
    }
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })
    return user 

    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
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
