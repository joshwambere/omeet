import {EUserAccountStatus} from "@prisma/client";

export interface IToken {
    refreshToken: string;
    accessToken: string;
}

export interface ITokenData {
    id: string | any;
    verified: EUserAccountStatus;
}
