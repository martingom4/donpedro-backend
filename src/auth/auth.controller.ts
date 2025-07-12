import { Controller, Post , Body} from '@nestjs/common';
import { AuthService } from './auth.service'; // este es el servicio de autenticacion

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}// Inicializa el controlador de autenticacion con el servicio de autenticacion
    @Post('register')
    register(@Body() body:{name: string; email: string; password: string}){
        return this.authService.authRegisterUser(body); // Llama al servicio de autenticacion para registrar un nuevo usuario
    }
}

