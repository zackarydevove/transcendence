import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import DatabaseService from "src/database/database.service";
import GameService from "./game.service"

@Module({
	controllers: [GameController],
	providers: [
		DatabaseService,
		GameService
	],
    exports: [GameService]
})
export default class GameModule {}
