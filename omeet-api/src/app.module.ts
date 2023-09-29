import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvs } from './__shared/configs/env/env.config';
import * as process from 'process';
import {join} from "path";
import {LoggerModule} from "nestjs-pino";
import {PinoLoggingSettings} from "./__shared/logging/PinoLoggingSettings";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";

const envFilePath: string | any = getEnvs(join(__dirname, '..')) || process.env;
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    PassportModule.register({
      session: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    LoggerModule.forRoot({
      pinoHttp: PinoLoggingSettings(process.env.NODE_ENV),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
