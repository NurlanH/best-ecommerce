
  
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from 'src/app.service';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {

    

    constructor(
        private readonly appService: AppService,
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
            passReqToCallback:true
        });
    }

    async validate(payload: any) {
        const {headers:{authorization}} = payload;
        const access_token = authorization.replace('Bearer','')?.trim();
        let verifiedUser = await this.appService.validateUser(access_token);
        if(!verifiedUser) return null
        return true;
    }
}