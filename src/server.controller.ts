import { TShockService } from './tshock.service';
import { Post, Get, Controller, Param, Body } from '@nestjs/common';
import { ServerStatusBody } from './api/tshock/types';
import { ResponseMessage } from './types';

@Controller('server')
export class ServerController {
  constructor(private readonly tsSvc: TShockService) {}

  @Get('status')
  async status(): Promise<ResponseMessage<ServerStatusBody>> {
    const body = await this.tsSvc.status();
    return {
      code: 0,
      message: '成功',
      data: body,
    };
  }

  @Get('motd')
  async motd(): Promise<ResponseMessage<string[]>> {
    const motdContent = await this.tsSvc.motd();
    return {
      code: 0,
      message: '成功',
      data: motdContent,
    };
  }

  @Get('rules')
  async rules(): Promise<ResponseMessage<string[]>> {
    const rulesContent = await this.tsSvc.rules();
    return {
      code: 0,
      message: '成功',
      data: rulesContent,
    };
  }

  @Post('broadcast')
  async broadcast(
    @Body('message') message: string,
  ): Promise<ResponseMessage<boolean>> {
    const succ = await this.tsSvc.broadcast(message);
    return {
      code: 0,
      message: '成功',
      data: succ,
    };
  }

  @Post('execute')
  async execCommand(
    @Body('command') command: string,
  ): Promise<ResponseMessage<string[]>> {
    const results = await this.tsSvc.execute(command);
    return {
      code: 0,
      message: '成功',
      data: results,
    };
  }
}
