import Axios, { AxiosInstance } from 'axios';

import {
  TShockRestApiResponse,
  TokenTestResponse,
  TokenCreateResponse,
  ServerStatusResponse,
  ServerMotdResponse,
  ServerRulesResponse,
  User,
  UserListResponse,
  UserReadResponse,
} from './types';

export default class TShockRestApi {
  private token?: string;
  private axios: AxiosInstance;

  constructor(
    baseUrl = `http://127.0.0.1:7878`,
    token: string | undefined = undefined,
    timeout = 1000,
  ) {
    this.token = token;
    this.axios = Axios.create({
      baseURL: baseUrl,
      timeout: timeout,
    });
  }

  private sendRequest<T>(uri: string, params: any, addToken = true) {
    if (addToken) {
      params.token = this.token;
    }
    return this.axios.get<T>(uri, {
      params,
    });
  }

  // region Token
  async tokenCreate(username: string, password: string): Promise<boolean> {
    // 构建请求
    const uri = `/v2/token/create`;
    const params = {
      username,
      password,
    };

    // 发送请求
    const resp = await this.sendRequest<TokenCreateResponse>(
      uri,
      params,
      false,
    );

    // 错误检测
    if (resp.status !== 200) {
      console.warn(
        `创建Token失败，响应状态码：${resp.status}，错误：${resp.data.error}`,
      );
      return false;
    }

    // 保存token
    this.token = resp.data.token;
    console.debug(`创建Token成功：${this.token}`);
    return true;
  }

  async tokenDestroy(token: string): Promise<boolean> {
    const uri = `/token/destroy/${token}`;
    const resp = await this.sendRequest<TokenCreateResponse>(uri, {}, false);
    if (resp.status !== 200) {
      console.warn(
        `销毁Token(${token})失败，响应状态码：${resp.status}，错误：${resp.data.error}`,
      );
      return false;
    }
    return true;
  }

  async tokenDestroyAll(): Promise<boolean> {
    const uri = `/v3/token/destroy/all`;
    const resp = await this.sendRequest<TokenCreateResponse>(uri, {}, false);
    if (resp.status !== 200) {
      console.warn(
        `销毁所有Token失败，响应状态码：${resp.status}，错误：${resp.data.error}`,
      );
      return false;
    }
    return true;
  }

  async tokenTest(): Promise<string | null> {
    const uri = `/tokentest`;
    const resp = await this.sendRequest<TokenTestResponse>(uri, {});
    if (resp.status !== 200) {
      console.warn(
        `测试Token失败，响应状态码：${resp.status}，错误：${resp.data.error}`,
      );
      return null;
    }
    return resp.data.associateduser;
  }
  // endregion

  // region Server
  async serverStatus(
    players = false,
    rules = false,
  ): Promise<ServerStatusResponse | null> {
    // 构建请求
    const uri = `/v2/server/status`;
    const params = {
      players,
      rules,
    };

    // 发送请求
    const resp = await this.sendRequest<ServerStatusResponse>(
      uri,
      params,
      false,
    );

    // 错误检测
    if (resp.status !== 200) {
      console.warn(
        `获取服务器状态失败，响应状态码：${resp.status}，错误：${resp.data.error}`,
      );
      return null;
    }

    return resp.data;
  }

  async serverMotd(): Promise<string[]> {
    const uri = `/v3/server/motd`;
    const resp = await this.sendRequest<ServerMotdResponse>(uri, {}, false);
    const motd: string[] = [];
    if (resp.status !== 200) {
      console.warn(
        `获取MOTD（motd.txt）失败，响应状态码：${resp.status}，错误：${resp.data.error}`,
      );
    } else {
      motd.push(...resp.data.motd);
    }
    return motd;
  }

  async serverRules(): Promise<string[]> {
    const uri = `/v3/server/rules`;
    const resp = await this.sendRequest<ServerRulesResponse>(uri, {}, false);
    const rules: string[] = [];
    if (resp.status !== 200) {
      console.warn(
        `获取服务器规则（rules.txt）失败，响应状态码：${resp.status}，错误：${resp.data.error}`,
      );
    } else {
      rules.push(...resp.data.rules);
    }
    return rules;
  }

  async serverBroadcast(msg: string): Promise<boolean> {
    const uri = `/v2/server/broadcast`;
    const params = {
      msg,
    };
    const resp = await this.sendRequest<TShockRestApiResponse>(uri, params);
    if (resp.status !== 200) {
      console.warn(
        `发送广播消息，响应状态码：${resp.status}，错误：${resp.data.error}`,
      );
      return false;
    }
    return true;
  }

  async serverRawCmd(cmd: string): Promise<string[]> {
    const uri = `/v3/server/rawcmd`;
    const params = {
      cmd,
    };
    const resp = await this.sendRequest<TShockRestApiResponse>(uri, params);
    const results: string[] = [];
    if (resp.status !== 200) {
      console.warn(
        `执行命令"${cmd}"，响应状态码：${resp.status}，错误：${resp.data.error}`,
      );
    } else {
      results.push(...resp.data.response);
    }
    return results;
  }
  // endregion

  // region User
  async userActiveList(): Promise<string[]> {
    const uri = `/v2/users/activelist`;
    const users: string[] = [];
    return users;
  }

  async userCreate(user: User): Promise<boolean> {
    const uri = `/v2/users/create`;
    return false;
  }

  async userList(): Promise<User[]> {
    const uri = `/v2/users/list`;
    const resp = await this.sendRequest<UserListResponse>(uri, {});
    const users: User[] = [];
    if (resp.status === 200) {
      users.push(...resp.data.users);
    } else {
      console.warn(
        `获取用户列表，响应状态码：${resp.status}，错误：${resp.data.error}`,
      );
    }
    return users;
  }

  async userRead(user: string | number, type: string): Promise<User | null> {
    const uri = `/v2/users/read`;
    const params = {
      user,
      type,
    };
    const resp = await this.sendRequest<UserReadResponse>(uri, params);
    if (resp.status !== 200) {
      console.warn(
        `获取用户信息，响应状态码：${resp.status}，错误：${resp.data.error}`,
      );
      return null;
    }
    const data = resp.data as User;
    return {
      group: data.group,
      id: data.id,
      name: data.name,
    } as User;
  }

  async userDestroy(user: string | number, type: string): Promise<boolean> {
    const uri = `/v2/users/destroy`;
    const params = {
      user,
      type,
    };
    const resp = await this.sendRequest<UserReadResponse>(uri, params);
    if (resp.status !== 200) {
      console.warn(
        `删除用户失败，响应状态码：${resp.status}，错误：${resp.data.error}`,
      );
      return false;
    }
    return true;
  }

  async userUpdate(
    user: string | number,
    type: string,
    fields: any,
  ): Promise<boolean> {
    const uri = `/v2/users/update`;
    return false;
  }
  // endregion

  // region Ban
  // endregion

  // region Player
  async playerLists() {
    const uri = `/v2/players/list`;
  }

  async playerRead() {
    const uri = `/v4/players/read`;
  }

  async playerKick() {
    const uri = `/v2/players/kick`;
  }

  async playerKill() {
    const uri = `/v2/players/kill`;
  }

  async playerMute() {
    const uri = `/v2/players/mute`;
  }

  async playerUnmute() {
    const uri = `/v2/players/unmute`;
  }
  // endregion

  // region World
  async worldRead() {
    // const uri = ``;
    const uri = `/world/read`;
  }

  async worldMeteor() {
    const uri = `/world/meteor`;
  }

  async worldBloodmoon(bloodmoon: boolean) {
    const uri = `/world/bloodmoon/${bloodmoon}`;
  }

  async worldBloodmoonV3(bloodmoon: boolean) {
    const uri = `/v3/world/bloodmoon`;
  }

  async worldSave() {
    const uri = `/v2/world/save`;
  }

  async worldAutoSave(state: boolean) {
    const uri = `/v2/world/autosave/state/${state}`;
  }

  async worldAutoSaveV3() {
    const uri = `/v3/world/autosave`;
  }

  async worldButcher() {
    const uri = `/v2/world/butcher`;
  }
  // endregion

  // region Group
  async groupList() {
    const uri = `/v2/groups/list`;
  }

  async groupRead() {
    const uri = `/v2/groups/read`;
  }

  async groupDestroy() {
    const uri = `/v2/groups/destroy`;
  }

  async groupCreate() {
    const uri = `/v2/groups/create`;
  }

  async groupUpdate() {
    const uri = `/v2/groups/update`;
  }
  // endregion
}
