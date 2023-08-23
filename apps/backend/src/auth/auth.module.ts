import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import DatabaseService from "src/database/database.service";
import UserService from "src/user/user.service";
import AuthMiddleware from "./auth.middleware";

@Module({
  controllers: [AuthController],
  providers: [
    DatabaseService,
    UserService,
    AuthService,
  ]
})
export default class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({
        path: 'auth/signout',
        method: RequestMethod.POST
      })
  }
}