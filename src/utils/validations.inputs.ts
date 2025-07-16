// aca vamos a hacer la validacion de los campos que vienen del body

export function validateEmail(email:string): boolean { // Funcion para validar el formato del email, que tenga ej. martin@dominio.com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// TODO  hacer una validacion donde sea un string al input y no un numero o un booleano
export function validateFields(data: Record<string, any>, requiredFields: string[]): boolean {
    for (const field of requiredFields) {
        const value = data[field];

        // Verifica que exista y sea un string no vacío
        if (typeof value !== 'string' || value.trim() === '') {
            return false;
        }
    }
    return true;
}

// TODOOOOOOO: cuando se vaya a hacer un registro la contrase;a posiblemente sea numeros solamente, por lo que se tendria que validar que sea un string o un numero


export function  validatePasswordLength(password: string): boolean{
    const minLength = 8
    const maxLength = 24
    return password.length >= minLength && password.length <= maxLength // si el largo de la password es mayor a 8 y menos a 24, retorna true si no retorna false

}

export function validateInputs(data: Record<string, any>, requiredFields: string[]): boolean {
    return validateFields(data, requiredFields) &&
           validateEmail(data.email) &&
           validatePasswordLength(data.password);// todo esto tiene que ser true para que se considere que los inputs son validos
}
