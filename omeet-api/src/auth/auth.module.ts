import { Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {PrismaService} from "../../prisma/prisma.service";
import { JwtService} from "@nestjs/jwt";
import {SendgridService} from "../__shared/utils/notifications/email.service";
import {PinoLogger} from "nestjs-pino";

@Module({
  controllers: [AuthController],
  providers: [AuthService,PrismaService,JwtService,SendgridService,PinoLogger],
})
export class AuthModule {}
