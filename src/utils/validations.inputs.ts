// aca vamos a hacer la validacion de los campos que vienen del body

export function validateEmail(email:string): boolean { // Funcion para validar el formato del email, que tenga ej. martin@dominio.com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// TODO  hacer una validacion donde sea un string al input y no un numero o un booleano
export function validateFields(data: Record<string, any>, requiredFields: string[]): boolean {
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            return false; // Si algún campo requerido está vacío o no existe, retorna false
        }
    }
    return true; // Si todos los campos requeridos están presentes y no están vacíos, retorna true
}


export function  validatePasswordLength(password: string): boolean{
    const minLength = 8
    const maxLength = 24
    return password.length >= minLength && password.length <= maxLength // si el largo de la password es mayor a 8 y menos a 24, retorna true si no retorna false

}
