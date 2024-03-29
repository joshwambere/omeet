export interface userLogin {
    email: string;
    password: string;
}

export interface userLoginResponse {
    message: string;
    data?: LoginData;
}

export type LoginData = {
    accessToken: string;
    refreshToken: string;
}

export interface userInfoResponse {
    data: userResponse;
    message: string;
}

export interface userResponse {
    _id: string;
    userName: string;
    email: string;
    employeeId: string;
    profileImage: string;
}
export type UserSignupResponse = {
    data?: any;
    message: string;
};

export type UserSignupRequest = {

    email: string;
    username: string;
    password: string;
};

export type UserVerifyRequest = {
    otp: string;
};
export type UserVerifyResponse = {
    data?: any;
    message: string;
};

export type userProfileResponse = {
    success: boolean;
    message: string;
};

export type userProfileRequest = {
    userName: string;
    profileImage: string;
};

export type forgotPasswordResponse = {
    message: string;
    data?: any;
};
export type forgotPasswordRequest = {
    email: string;
};

export type resetPasswordResponse = {
    message: string;
    success: boolean;
};
export type resetPasswordRequest = {
    password: string;
    token: string;
};
