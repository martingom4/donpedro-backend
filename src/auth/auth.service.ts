import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';


import { validateInputs} from '../utils/validations.inputs';
import { UsersService } from '../users/users.service';
import { normalizeInputs } from '../utils/normalize.inputs';
@Injectable()
// funcion encargada de manejar la logica de autenticacion
// se encarga de resitro, login, manejo de tokens

export class AuthService {
    constructor(private prisma:PrismaService, private jwt: JwtService, private usersService: UsersService) {}// Constructor que sirve para inyectar el servicio PrismaService y JwtService
    // funciona encargada del registro de usuarios

    async authRegisterUser(data:{name:string, email:string, password:string}){
        // tengo que hacer la encriptacion de la password
        // valida que el usuario no exista, esto se hace llamando el modulo de users
        // y se crea el usuario, llamandolo tambien a user.create
        // retorna access token y refresh token para autenticacion automatica a la aplicacion
        const requiredFields = ['name', 'email', 'password']; // campos requeridos para el registro
        const normalizedData = normalizeInputs(data) // normalizamos los datos de entrada es decir ANILYS quitamos los espacios en blanco y convertimos a minusculas para normalizar los datos de entrada
        if (!validateInputs(normalizedData, requiredFields)) { // si los datos no son validos, lanza una excepcion esto se trae desde utils/validations.inputs.ts 
            throw new BadRequestException('Invalid input data');
        }


    }

}

