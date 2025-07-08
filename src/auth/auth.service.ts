import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';


import { validateEmail, validateFields, validatePasswordLength} from '../utils/validations.inputs';
import { normalizeInputs } from '../utils/normalize.inputs';
@Injectable()
// funcion encargada de manejar la logica de autenticacion
/*
se encarga de resitro, login, manejo de tokens
*/
export class AuthService {
    constructor(private prisma:PrismaService, private jwt: JwtService) {}// Constructor que sirve para inyectar el servicio PrismaService y JwtService
   
    // registro de de tokens
    async register(data:{name: string, email:string, password:string}){
        const requiredFields = ['name', 'email', 'password'];
        data = normalizeInputs(data)
       //verificar el email
        const isValidEmail = validateEmail(data.email); // Llama a la funcion de validacion de email
        const isValidPasswordLength = validatePasswordLength(data.password); // Llama a la funcion de validacion de longitud de contraseña
        if(!isValidPasswordLength){ // Verifica si la contraseña cumple con los requisitos de longitud
            throw new BadRequestException('La contraseña debe tener entre 8 y 24 caracteres');
        }
        if(!validateFields(data, requiredFields)){ // Verifica si los campos requeridos estan presentes y no estan vacios
            throw new BadRequestException('Campos requeridos faltantes'); // Si falta algun campo requerido, lanza una excepción
        }
        if(!isValidEmail){
            throw new BadRequestException('Email invalido');
        }

        const userExists = await this.prisma.user.findUnique({
            where:{ email: data.email }, // Verifica si el usuario ya existe
        });
        if(userExists){
            throw new UnauthorizedException('Email en uso'); // Si el usuario ya existe, lanza una excepción
        }
        const hashedPassword = await bcrypt.hash(data.password,10) // hashea la contraseña del usuario

        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword
            }
        })
        return {message: "Usuario registrado correctamente", userId: user.id}; // Retorna un mensaje de éxito y el ID del usuario registrado

    }
}
