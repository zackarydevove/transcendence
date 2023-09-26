import { Body, Controller, Get, Patch, HttpException } from "@nestjs/common";
import UserService from "./user.service";


@Controller('user')
export default class UserController {

  constructor(
    private userService: UserService,
  ) { }

  @Get('profile')
  async profile(@Body('userId') userId: string) {
    const user = await this.userService.findUserById(userId)
    if (!user) {
      throw new HttpException(
        "User not found.",
        404
      )
    }
    return user // TODO: remove password from response
  }

  @Patch('2fa')
  async setup2fa(@Body('userId') userId: string) {
    return await this.userService.toggle2fa(userId)
  }

  @Patch('status')
  async changeStatus(@Body('userId') userId: string, @Body('status') status:  "online" | "offline" | "ingame") {
	  return this.userService.changeUserStatus(userId, status);
  }
}