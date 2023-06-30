export interface TShockRestApiResponse {
  status: string;
  error?: string;
}

export interface TokenCreateResponse extends TShockRestApiResponse {
  response: string;
  token: string;
}

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

export interface ServerStatusResponse extends TShockRestApiResponse {
  name: string;
  serverversion: string;
  tshockversion: string;
  port: number;
  playercount: number;
  maxplayers: number;
  world: string;
  uptime: string;
  serverpassword: string;
  players: Player[];
  rules: Rules;
}
