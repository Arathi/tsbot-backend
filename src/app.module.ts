import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TShockService } from './tshock.service';
import { ServerController } from './server.controller';
import UserController from './user.controller';

@Module({
  imports: [],
  controllers: [AppController, ServerController, UserController],
  providers: [AppService, TShockService],
})
export class AppModule {}
