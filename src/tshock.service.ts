import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import TShockRestApi from './api/tshock/api';
import { ServerStatusBody, User, UserCondition } from './api/tshock/types';

@Injectable()
export class TShockService {
  private api: TShockRestApi;

  constructor() {
    const userName = process.env.TS_REST_API_USERNAME;
    const password = process.env.TS_REST_API_PASSWORD;
    const baseUrl = process.env.TS_REST_API_BASEURL;
    this.api = new TShockRestApi(userName, password, baseUrl);
  }

  // region Server
  async status(players = true, rules = true): Promise<ServerStatusBody> {
    const resp = await this.api.serverStatus(players, rules);
    delete resp.status;
    return resp as ServerStatusBody;
  }

  async motd(): Promise<string[]> {
    const resp = await this.api.serverMotd();
    return resp.motd;
  }

  async rules(): Promise<string[]> {
    const resp = await this.api.serverRules();
    return resp.rules;
  }

  async broadcast(message: string): Promise<boolean> {
    const resp = await this.api.serverBroadcast(message);
    return resp.status === '200';
  }

  async execute(command: string): Promise<string[]> {
    const resp = await this.api.serverRawCmd(command);
    return resp.response as string[];
  }
  // endregion

  // region User
  async getUsers(): Promise<User[]> {
    const resp = await this.api.usersList();
    return resp.users;
  }

  async getActiveUsers(): Promise<string[]> {
    return [];
  }

  async createUser(
    user: string,
    password: string,
    group: string | null = null,
  ): Promise<boolean> {
    const resp = await this.api.usersCreate(user, password, group);
    return resp.status === '200';
  }

  private userCondition(input: string): UserCondition {
    const id = Number(input);
    if (isNaN(id)) {
      return {
        user: input,
        type: 'name',
      };
    }
    return {
      user: id,
      type: 'id',
    };
  }

  async removeUser(idOrName: string): Promise<boolean> {
    const cond = this.userCondition(idOrName);
    const resp = await this.api.usersDestroy(cond);
    return resp.status === '200';
  }

  async saveUser(
    idOrName: string,
    password?: string,
    group?: string,
  ): Promise<boolean> {
    const cond = this.userCondition(idOrName);
    const resp = await this.api.usersUpdate(cond, password, group);
    return resp.status === '200';
  }

  async getUser(idOrName: string): Promise<User> {
    const cond = this.userCondition(idOrName);
    const resp = await this.api.usersRead(cond);
    return {
      name: resp.name,
      id: resp.id,
      group: resp.group,
    };
  }
  // endregion
}
