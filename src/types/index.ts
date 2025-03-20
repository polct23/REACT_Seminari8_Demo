export interface Sub {
    nick: string;
    edad: number;
    correo?: string;
}

export type SubsResponseFromApi = Array<{
    name: string;
    age: number;
    email?: string;
}>;