import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TShockService } from './tshock.service';
import { ServerController } from './server.controller';

@Module({
  imports: [],
  controllers: [AppController, ServerController],
  providers: [AppService, TShockService],
})
export class AppModule {}
