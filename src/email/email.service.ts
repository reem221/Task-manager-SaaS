import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createTransport, Transporter } from 'nodemailer'; 
import * as Mail from 'nodemailer/lib/mailer';
import { User } from 'src/user/user.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private nodemailerTransport: Transporter;

  constructor( 
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.nodemailerTransport = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'), 
      },
    });
  }

  private async sendMail(options: Mail.Options) {
    this.logger.log(`Email sent to: ${options.to}`);
    return this.nodemailerTransport.sendMail(options);
  }

  public async sendResetPasswordLink(email: string, token: string): Promise<void> {
    const url = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}?token=${token}`;
    const text = `Hi,\nTo reset your password, click here: ${url}\n\nThis link expires in 15 minutes.`;

    await this.sendMail({
      to: email,
      subject: 'Reset Password',
      text,
    });
  }

  public async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      throw new BadRequestException('The link has expired or is invalid');
    }
  }
}