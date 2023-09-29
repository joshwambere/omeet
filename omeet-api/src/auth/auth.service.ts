import {BadGatewayException, BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateAuthDto} from './dto/create-auth.dto';
import {UpdateAuthDto} from './dto/update-auth.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {
    AUTH_USER_CREATED_VERIFICATION_EMAIL_SENT,
    GLOBAL_USER_EXISTS,
    NOTIFICATION_EMAIL_NOT_SENT
} from "../__shared/constants/messages.constants";
import {emailTemplate as EmailTemplate} from "../__shared/utils/notifications/emailTemplates/email.template";
import {JwtService} from '@nestjs/jwt';
import {IToken, ITokenData} from "../__shared/interface/IToken.interface";
import {
    ACCESS_TOKEN_EXPIRATION_TIME,
    BACKEND_APP_URL,
    REFRESH_TOKEN_EXPIRATION_TIME
} from "../__shared/configs/env/env.constant";
import {SendgridService} from "../__shared/utils/notifications/email.service";
import {config} from "dotenv";
import {ConfigService} from "@nestjs/config";
import {PinoLogger} from "nestjs-pino";
import {hashService} from "../__shared/utils/security/password/HashFunction";

@Injectable()
export class AuthService {

    constructor(private readonly prisma: PrismaService, private jwtService: JwtService, private readonly emailService: SendgridService, private readonly configService: ConfigService, private readonly logger: PinoLogger) {
        config();
    }

    async create(createAuthDto: CreateAuthDto) {
        const {email, password, username} = createAuthDto;

        try {
            // Start a database transaction
            await this.prisma.$transaction(async (prisma) => {
                const isUserExist = await prisma.user.findFirst({
                    where: {
                        email,
                    },
                });

                if (isUserExist)
                    throw new BadRequestException(GLOBAL_USER_EXISTS);

                // Create the user within the transaction
                const hashedPassword = await hashService(password);
                const user = await prisma.user.create({
                    data: {
                        email,
                        password:hashedPassword ,
                        username,
                    },
                });

                const tokenData: ITokenData = {
                    id: user.id,
                    verified: user.status,
                };

                const signToken = await this.signToken(tokenData);

                const verifyEmailLink = this.constructVerifyEmailLink(signToken.accessToken);

                const emailTemplate = EmailTemplate(verifyEmailLink);
                const mail = this.emailService.buildMail(email, emailTemplate, 'Verify your email', 'Verify your email');

                await this.emailService.sendEmail(mail);
            });

            return {
                message: AUTH_USER_CREATED_VERIFICATION_EMAIL_SENT,
                data: null,
            };
        } catch (e) {
            this.logger.error(e);
            throw new BadGatewayException(NOTIFICATION_EMAIL_NOT_SENT);
        }

    }

    findAll() {
        return `This action returns all auth`;
    }

    findOne(id: number) {
        return `This action returns a #${id} auth`;
    }

    update(id: number, updateAuthDto: UpdateAuthDto) {
        return `This action updates a #${id} auth`;
    }

    remove(id: number) {
        return `This action removes a #${id} auth`;
    }

    async signToken(tokenData: ITokenData): Promise<IToken> {
        try {
            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync(tokenData, {
                    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
                    secret: this.configService.get('JWT_SECRET'),
                }),
                this.jwtService.signAsync(tokenData, {
                    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
                    secret: this.configService.get('JWT_SECRET'),
                }),
            ]);
            return {
                accessToken,
                refreshToken,
            };
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    constructVerifyEmailLink(token: string): string {
        return `${BACKEND_APP_URL}/auth/verify/${token}`;
    }
}
