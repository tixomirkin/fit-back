import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import {TokenPayload} from "./interface/tokenPayload.interface";
// import {TokenPayload} from './tokenPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UsersService,
    ) {
        // super({
        //     jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        //         return request?.cookies?.Authentication;
        //     }]),
        //     secretOrKey: configService.get('JWT_SECRET')
        // });
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: String(configService.get('JWT_SECRET'))
        });

    }

    async validate(payload: TokenPayload) {
        return this.userService.getByIdWithoutPass(payload.userId);
    }
}