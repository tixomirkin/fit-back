import {IsEmail, IsNotEmpty, IsString, Length, IsOptional, Matches} from "class-validator";
import {ApiProperty, PartialType} from '@nestjs/swagger';

export class LoginDto {

    @ApiProperty({
        description: 'The email address',
        default: "test@test.com",
    })
    @IsEmail()
    readonly email: string

    @ApiProperty({
        description: 'The password',
        default: "Qwert1234",
        minLength: 8,
        maxLength: 64
    })
    @IsString()
    @Length(8, 64)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    @IsNotEmpty()
    password: string;


    // @ValidateNested()
}

