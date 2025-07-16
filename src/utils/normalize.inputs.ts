// aca se normalizan los inputs que vienen del body, para que esten en un formato estandarizado y se puedan guardar en la base de datos

export function normalizeInputs(data: Record<string,any>): Record<string,any>{ // record es una manera de definir que lo que se espera es una diccionario clave-valor en ts
    const normalizandData: Record<string,any> = {}

    for(const key in data){
        normalizandData[key] = data[key].trim().toLowerCase(); // Normaliza los inputs, eliminando espacios al principio y al final, y convirtiendo a minusculas

    }
    return normalizandData;

}
