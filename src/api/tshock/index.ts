import Axios, { AxiosInstance } from 'axios';

import {
  TShockRestApiResponse,
  TokenCreateResponse,
  ServerStatusResponse,
  ServerMotdResponse,
  ServerRulesResponse,
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
  // endregion

  // region Ban
  // endregion

  // region Player
  // endregion

  // region World
  // endregion

  // region Group
  // endregion
}
