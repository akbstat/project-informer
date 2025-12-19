export interface AuthParam {
    email: string,
    password: string,
}

export interface AuthResponse {
    refresh: string,
    access: string,
}