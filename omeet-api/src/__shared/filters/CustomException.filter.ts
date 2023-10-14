import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            statusCode: status,
            message: this.getExceptionMessage(exception),
        });
    }

    /**
     * Get the exception message in an ordered manner
     * @param exception
     * @private
     */
    private getExceptionMessage(exception: HttpException): string {
        const message = (() => {
            try {
                return exception.getResponse();
            } catch (error) {
                return error instanceof TypeError ? exception.message : error;
            }
        })();

        if (typeof message === 'object') {
            if (Array.isArray(message['message'])) {
                return message['message'].map((item) => item).join(', ');
            } else {
                return message['message'];
            }
        }
        return message;
    }
}
