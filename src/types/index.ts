export interface User {
    id?: string; // El frontend usará este atributo
    _id?: string; // El backend devuelve este atributo
    name: string;
    age: number;
    email: string;
    password?: string; // Opcional si no siempre está presente
    phone?: number; // Opcional si no siempre está presente
}