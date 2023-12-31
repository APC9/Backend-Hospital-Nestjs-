import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy( Strategy, 'google'){

  constructor(
    configService: ConfigService
  ){
    super({
      clientID: configService.get('GOOGLE_ID'),
      clientSecret: configService.get('GOOGLE_SECRET'),
      callbackURL: "http://localhost:4500/auth/google-redirect",
      scope: ['email', 'profile']
    })
  }

  async validate(
    accessToken: string, 
    refreshToken: string, 
    profile: any, 
    done: VerifyCallback 
    ):Promise<any>{
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      img: photos[0].value,
      accessToken,
      refreshToken
    }

    done(null, user)
  }
}