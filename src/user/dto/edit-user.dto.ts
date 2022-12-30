import { IsEmail, IsOptional, IsString } from "class-validator"

export class EditUserDto {
    @IsEmail()
    @IsOptional()
    // name has to be like in db
    email?: string;

    @IsString()
    @IsOptional()
    // name has to be like in db
    first_name?: string;

    @IsString()
    @IsOptional()
    // name has to be like in db
    last_name?: string;
}