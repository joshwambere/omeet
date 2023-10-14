export interface User{
    id: string;
    username: string;
    email: string;
}

export interface IToken {
    refreshToken: string;
    accessToken: string;
}
