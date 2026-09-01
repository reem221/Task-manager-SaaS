import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createTransport, Transporter } from 'nodemailer'; 
import * as Mail from 'nodemailer/lib/mailer';
import { User } from 'src/entity/user.entity';

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

  public async sendResetPasswordLink(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('The email address is not registered');
    }

    const payload = { email };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`, 
    });

    
    user.passwordResetCode = token;
    await this.userRepository.save(user);

    const url = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}?token=${token}`;
    const text =  `Hi, \nTo reset your password, click here: ${url}`;;

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