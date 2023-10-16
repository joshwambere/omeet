import {
    BadGatewayException,
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException, NotFoundException
} from '@nestjs/common';
import {CreateAuthDto, LoginAuthDto} from './dto/create-auth.dto';
import {UpdateAuthDto} from './dto/update-auth.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {
    AUTH_USER_ALREADY_VERIFIED,
    AUTH_USER_CREATED_VERIFICATION_EMAIL_SENT,
    AUTH_USER_INVALID_CREDENTIALS,
    AUTH_USER_LOGGED_IN,
    AUTH_USER_NOT_FOUND,
    AUTH_USER_VERIFIED,
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
import {compareHash, hashService} from "../__shared/utils/security/password/HashFunction";
import {EUserAccountStatus} from "../__shared/enums/EUser-Account.status";

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

    async verify(token: string) {
        try {
            const {id} = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });

            const user = await this.prisma.user.findFirst({
                where: {
                    id,
                }
            })

            if (user ==null)
                throw new BadRequestException(AUTH_USER_NOT_FOUND);

            if (user.status === EUserAccountStatus.VERIFIED)
                throw new BadRequestException(AUTH_USER_ALREADY_VERIFIED);

            await this.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    status: EUserAccountStatus.VERIFIED,
                },
            });

            return {
                message: AUTH_USER_VERIFIED,
                data: null,
            };
        } catch (e) {
            throw new HttpException(e.message,e.status);
        }
    }
    async login(loginAuthDto: LoginAuthDto) {
        const {email, password} = loginAuthDto;
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    email,
                }
            })

            if (user == null)
                throw new NotFoundException(AUTH_USER_NOT_FOUND);

            if (user.status !== EUserAccountStatus.VERIFIED)
                throw new BadRequestException(AUTH_USER_NOT_FOUND);

            const isPasswordValid = await compareHash(password, user.password);

            if (!isPasswordValid)
                throw new BadRequestException(AUTH_USER_INVALID_CREDENTIALS);

            const tokenData: ITokenData = {
                id: user.id,
                verified: user.status,
            }

            const signToken = await this.signToken(tokenData);

            return{
                message: AUTH_USER_LOGGED_IN,
                data: signToken,
            }

        }catch (e){
            this.logger.error(e);
            throw new HttpException(e.message,e.status);
        }
    }

    async getUserInformation(token: string) {
        const {id} = await this.jwtService.verifyAsync(token, )
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
        return `${BACKEND_APP_URL}/auth/verify?t=${token}`;
    }
}
