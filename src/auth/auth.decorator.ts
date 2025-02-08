import { UseGuards, applyDecorators } from '@nestjs/common'
import {ApiBearerAuth} from "@nestjs/swagger";
import JwtAuthenticationGuard from "./guards/jwt-authentication.guard";

export const Auth = () => {
    return applyDecorators(
        UseGuards(JwtAuthenticationGuard),
        ApiBearerAuth()
    );

}
