//Typer för autentisering context fil
export interface User {
    _id: string,
    firstname: string,
    lastname: string,
    email: string,
    username: string,
    password: string
}

//Registrerings credentials
export interface RegisterCredentials {
    firstname: string,
    lastname: string,
    email: string,
    username: string,
    password: string
}

//Inloggning credentials
export interface LoginCredentials {
    username: string,
    password: string
}

//Respons
export interface AuthResponse {
    user: User,
    token: string
}

export interface ProtectedRouteResponse {
    user: User
}

export interface AuthContextType {
    user: User | null,
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>
    logout: () => void;
}