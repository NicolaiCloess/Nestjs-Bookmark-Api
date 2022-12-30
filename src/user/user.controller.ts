import { Controller, Get, UseGuards, Patch, Body } from '@nestjs/common';
import { GetUser } from '../../src/auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from "../auth/guard"
import { EditUserDto } from './dto';
import { UserService } from './user.service';
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) {

    }

    @Get("me")
    getMe(@GetUser() user: User) {
        
        return user;
    }

    @Patch()
    editUser(
        @GetUser("id") userID: number,
        @Body() dto: EditUserDto,
    ) {
        return this.userService.editUser(userID, dto)
    }

}
