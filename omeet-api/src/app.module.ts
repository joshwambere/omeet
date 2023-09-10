import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvs } from './__shared/configs/env/env.config';
import * as process from 'process';
import {join} from "path";
import {LoggerModule} from "nestjs-pino";
import {PinoLoggingSettings} from "./__shared/logging/PinoLoggingSettings";
import {ConfigModule} from "@nestjs/config";
import { UsersModule } from './users/users.module';

const envFilePath: string | any = getEnvs(join(__dirname, '..')) || process.env;
@Module({
  imports: [

    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: PinoLoggingSettings(process.env.NODE_ENV),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
