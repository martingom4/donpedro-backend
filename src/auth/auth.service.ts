import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService, private jwt: JwtService) {}// Constructor que sirve para inyectar el servicio PrismaService y JwtService

    // registro de usuario
    async register(data:{name: string, email:string, password:string}){

        /*
        TODO Cosas por integrar
           1. Verificar campos requeridos, Que no vengan null ni vacios
           2. Validar el formato del email
           3. validar longitud de la contraseña minimo de 8 caracteres maximo 64
           4. Normalizar inputs para guardar en la base de datos
        */
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
