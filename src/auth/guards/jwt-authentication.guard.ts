
import {ExecutionContext, Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {Reflector} from "@nestjs/core";

import { SetMetadata } from '@nestjs/common';
export const Public = () => SetMetadata('isPublic', true);

@Injectable()
export default class JwtAuthenticationGuard extends AuthGuard('jwt') {

    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
}