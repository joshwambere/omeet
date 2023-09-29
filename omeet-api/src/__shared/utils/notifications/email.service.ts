import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import {SENDER_EMAIL} from "../../configs/env/env.constant";

@Injectable()
export class SendgridService {
    constructor(private readonly configService: ConfigService) {
        SendGrid.setApiKey(configService.get('SENDGRID_API_KEY'));
    }

    private senderEmail = SENDER_EMAIL

    async sendEmail(mail: SendGrid.MailDataRequired) {
        return await SendGrid.send(mail);
    }

    buildMail(email: string, template: string, subject: string, introduction:string) {
        return  {
            to: email,
            subject: subject,
            from: this.senderEmail,
            text: introduction,
            html: template,
        };
    }
}
