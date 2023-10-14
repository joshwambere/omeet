import {BAD_REQUEST, UNAUTHORIZED} from "../_shared/constants/StatusCode.constant";

class SignalingException extends Error {
    public statusCode: number | undefined;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, SignalingException.prototype);
    }

    public static throw(message: string, statusCode: number) {
        const exception = new this(message);
        exception.statusCode = statusCode;
        throw exception;
    }
}

export class BadRequestException extends SignalingException {
    constructor(message: string) {
        super(message);
        this.statusCode = BAD_REQUEST;
    }
}

export class UnauthorizedException extends SignalingException {
    constructor(message: string) {
        super(message);
        this.statusCode = UNAUTHORIZED;
    }
}
