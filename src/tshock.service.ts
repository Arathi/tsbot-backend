import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import TShockRestApi from './api/tshock';
import { ServerStatusResponse } from './api/tshock/types';

@Injectable()
export class TShockService {
  private api: TShockRestApi;

  constructor() {
    this.api = new TShockRestApi(process.env.TS_REST_API_BASEURL);
  }

  async login(): Promise<boolean> {
    const userName = process.env.TS_REST_API_USERNAME;
    const password = process.env.TS_REST_API_PASSWORD;
    console.debug(
      `正在创建TShock REST API Token，用户名：${userName}，密码：${password}`,
    );
    return this.api.tokenCreate(userName, password);
  }

  // region Server
  async status(): Promise<ServerStatusResponse | null> {
    return this.api.serverStatus(true, true);
  }

  async motd(): Promise<string[]> {
    return this.api.serverMotd();
  }

  async rules(): Promise<string[]> {
    return this.api.serverRules();
  }

  async broadcast(message: string): Promise<boolean> {
    return this.api.serverBroadcast(message);
  }

  async execCommand(cmd: string): Promise<string[]> {
    return this.api.serverRawCmd(cmd);
  }
  // endregion

  // region User
  // endregion
}
