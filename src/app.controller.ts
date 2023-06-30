import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ServerStatusResponse } from './api/tshock/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  async login(): Promise<string> {
    const resp = await this.appService.login();
    const result = resp ? '成功' : '失败';
    return `登录${result}`;
  }

  @Get('status')
  async status(): Promise<ServerStatusResponse | null> {
    return this.appService.status();
  }
}
