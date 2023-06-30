import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import TShockRestApi from './api/tshock';
import { ServerStatusResponse } from './api/tshock/types';
// import tsConfig from './config/tshock.json';

@Injectable()
export class AppService {
  private tsRestApi: TShockRestApi;

  constructor() {
    this.tsRestApi = new TShockRestApi(process.env.TS_REST_API_BASEURL);
  }

  get api(): TShockRestApi {
    return this.tsRestApi;
  }

  getHello(): string {
    return 'Hello World!';
  }

  async login(): Promise<boolean> {
    const userName = process.env.TS_REST_API_USERNAME;
    const password = process.env.TS_REST_API_PASSWORD;
    console.debug(
      `正在创建TShock REST API Token，用户名：${userName}，密码：${password}`,
    );
    return this.api.tokenCreate(userName, password);
  }

  async status(): Promise<ServerStatusResponse | null> {
    return this.api.serverStatus(true, true);
  }
}
