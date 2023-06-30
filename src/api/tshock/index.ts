import Axios, { AxiosInstance } from 'axios';

import { TokenCreateResponse, ServerStatusResponse } from './types';

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
}
