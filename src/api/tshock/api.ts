import Axios, { AxiosInstance } from 'axios';
import {
  ServerMotdResponse,
  ServerRulesResponse,
  ServerStatusResponse,
  TokenCreateResponse,
  TokenTestResponse,
  TShockRestApiResponse,
  UserActiveListResponse,
  UserCondition,
  UserListResponse,
  UserReadResponse,
} from './types';

export default class TShockRestApi {
  axios: AxiosInstance;
  userName: string;
  password: string;
  token: string | null;

  constructor(
    userName: string,
    password: string,
    baseUrl = 'http://127.0.0.1:7878',
    timeout = 1000,
    token: string | null = null,
  ) {
    this.userName = userName;
    this.password = password;
    this.token = token;
    this.axios = Axios.create({
      baseURL: baseUrl,
      timeout: timeout,
    });
  }

  async getRequest<R extends TShockRestApiResponse>(
    uri: string,
    params: any = {},
    needToken = true,
  ): Promise<R | null> {
    if (needToken) {
      // 如果token没有获取，先获取token
      if (this.token == null) {
        await this.tokenCreate(this.userName, this.password);
      }
      params.token = this.token;
    }
    try {
      const resp = await this.axios.get<R>(uri, {
        params,
      });
      const data = resp.data;
      if (resp.status !== 200) {
        console.warn(`向TShock发送GET请求${uri}出错，请求内容`, resp.request);
        console.warn(
          `结果码：${resp.status}(${resp.statusText})，响应报文：`,
          data,
        );
      }
      return data;
    } catch (ex) {
      console.error(`向TShock REST API发送GET请求(${uri})发生异常`, ex);
    }
    return null;
  }

  // region Token
  async tokenCreate(username: string, password: string) {
    const uri = `/v2/token/create`;
    const params = { username, password };
    const respBody = await this.getRequest<TokenCreateResponse>(
      uri,
      params,
      false,
    );
    if (respBody != null) {
      this.token = respBody.token;
    }
    return respBody;
  }

  async tokenDestroy(token: string | null = null) {
    if (token == null) token = this.token;
    const uri = `/token/destroy/${token}`;
    return this.getRequest<TShockRestApiResponse>(uri);
  }

  async tokenDestroyAll() {
    const uri = `/token/destroy/all`;
    return this.getRequest<TShockRestApiResponse>(uri);
  }

  async tokenTest() {
    const uri = `/tokentest`;
    return this.getRequest<TokenTestResponse>(uri);
  }
  // endregion

  // region Server
  async serverStatus(players = false, rules = false) {
    const uri = `/v2/server/status`;
    const params = {
      players,
      rules,
    };
    return this.getRequest<ServerStatusResponse>(uri, params, false);
  }

  async serverMotd() {
    const uri = `/v3/server/motd`;
    return this.getRequest<ServerMotdResponse>(uri, {}, false);
  }

  async serverRules() {
    const uri = `/v3/server/rules`;
    return this.getRequest<ServerRulesResponse>(uri, {}, false);
  }

  async serverBroadcast(msg: string) {
    const uri = `/v2/server/broadcast`;
    const params = {
      msg,
    };
    return this.getRequest<TShockRestApiResponse>(uri, params);
  }

  async serverReload() {
    const uri = `/v3/server/reload`;
    return this.getRequest<TShockRestApiResponse>(uri);
  }

  async serverOff() {
    const uri = `/v2/server/off`;
    return this.getRequest<TShockRestApiResponse>(uri);
  }

  async serverRawCmd(cmd: string) {
    const uri = `/v3/server/rawcmd`;
    const params = {
      cmd,
    };
    return this.getRequest<TShockRestApiResponse>(uri, params);
  }
  // endregion

  // region Users
  async usersActiveList() {
    const uri = `/v2/users/activelist`;
    return this.getRequest<UserActiveListResponse>(uri);
  }

  async usersCreate(
    user: string,
    password: string,
    group: string | null = null,
  ) {
    const uri = `/v2/users/create`;
    const params: any = { user, password };
    if (group != null) {
      params.group = group;
    }
    return this.getRequest<TShockRestApiResponse>(uri, params);
  }

  async usersList() {
    const uri = `/v2/users/list`;
    return this.getRequest<UserListResponse>(uri);
  }

  async usersRead(cond: UserCondition) {
    const uri = `/v2/users/read`;
    const params: any = { ...cond };
    return this.getRequest<UserReadResponse>(uri, params);
  }

  async usersDestroy(cond: UserCondition) {
    const uri = `/v2/users/destroy`;
    const params: any = { ...cond };
    return this.getRequest(uri, params);
  }

  async usersUpdate(cond: UserCondition, password?: string, group?: string) {
    const uri = `/v2/users/update`;
    const params: any = { ...cond };
    if (password != undefined) params.password = password;
    if (group != undefined) params.group = group;
    return this.getRequest(uri, params);
  }
  // endregion
}
