import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { Request as RequestType } from 'express';
import {PrismaService} from "../../../prisma/prisma.service";

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private prisma: PrismaService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                AuthStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const { id } = payload;

        const user = await this.prisma.user.findFirst({ where: { id } })
        return user ? user : null;
    }
    private static extractJWT(req: RequestType): string | null {
        if (req.headers.authorization && req.headers.authorization.length > 0) {
            return req.headers.authorization.split(' ')[1];
        }
        return null;
    }
}
