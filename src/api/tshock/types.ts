// region Commons
export interface TShockRestApiResponse {
  status: string;
  response: string | string[] | undefined;
  error?: string;
}
// endregion

// region Token
export interface TokenCreateResponse extends TShockRestApiResponse {
  token: string;
}

export interface TokenTestResponse extends TShockRestApiResponse {
  associateduser: string;
}
// endregion

// region Server
interface Player {
  nickname: string;
  username: string;
  group: string;
  active: boolean;
  state: any;
  team: any;
}

type PvPMode = 'normal' | 'always' | 'disabled';

interface Rules {
  AutoSave: boolean;
  DisableBuild: boolean;
  DisableClownBombs: boolean;
  DisableDungeonGuardian: boolean;
  DisableInvisPvP: boolean;
  DisableSnowBalls: boolean;
  DisableTombstones: boolean;
  EnableWhitelist: boolean;
  HardcoreOnly: boolean;
  PvPMode: PvPMode;
  SpawnProtection: boolean;
  SpawnProtectionRadius: number;
  ServerSideInventory: boolean;
}

export interface ServerStatusBody {
  name: string;
  serverversion: string;
  tshockversion: string;
  port: number;
  playercount: number;
  maxplayers: number;
  world: string;
  uptime: string;
  serverpassword: string;
  players?: Player[];
  rules?: Rules;
}

export type ServerStatusResponse = TShockRestApiResponse & ServerStatusBody;

export interface ServerMotdResponse extends TShockRestApiResponse {
  motd: string[];
}

export interface ServerRulesResponse extends TShockRestApiResponse {
  rules: string[];
}
// endregion

// region Users
export interface User {
  name: string;
  id: number;
  group: string;
}

type UserType = 'name' | 'id';

export interface UserCondition {
  user: string | number;
  type: UserType;
}

export interface UserActiveListResponse extends TShockRestApiResponse {
  activeusers: string;
}

export interface UserListResponse extends TShockRestApiResponse {
  users: User[];
}

export type UserReadResponse = TShockRestApiResponse & User;
// endregion
