import { Injectable } from "@nestjs/common/decorators";
import { PrismaService } from "../../src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { ForbiddenException } from "@nestjs/common/exceptions";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt/dist";
import { ConfigService } from "@nestjs/config/dist/config.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async signup(dto: AuthDto){

        // generate password hash
        // nur zur vereinfachung, eigentlich schon als hash vom Frontend senden!!!
        const hash = await argon.hash(dto.password)

        //save the user in db
        try{
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
                select:{
                    id: true,
                    email: true,
                    created_at: true,
                }
            })

            return this.signToken(user.id, user.email);  
        } catch(error){
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Credentials taken",);
                }
            }
            throw error;
        }
    }

    async signin(dto: AuthDto){

        // find user email
        const user = await this.prisma.user.findUnique({
            where: { 
                email: dto.email,
            },
        })

        // if user does not exist throw exception
        if (!user) {

            throw new ForbiddenException(
                "Credentials incorrect",
            );
        }

        //compare passwords
        const pwMatches = await argon.verify(
            user.hash,
            dto.password,
        )

        //if password is incorrect throw exception
        if (!pwMatches) {
            throw new ForbiddenException(
                "Credentials incorrect",
            );
        }

        return this.signToken(user.id, user.email);

    }

    async signToken(user_id: number, email: string): Promise<{access_token: string}>  {

        const payload = {
            sub: user_id,
            email,
        }

        const secret = this.config.get("JWT_SECRET")

        const token = await this.jwt.signAsync(payload, {
            expiresIn: "30m",
            secret: secret,
        })

        return {
            access_token: token,

        };
    }
}