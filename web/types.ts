export type ReputationLevel = "优" | "一般" | "差";

export type Lobby =
  | "5v5_pvp_ranked"
  | "5v5_pvp_casual"
  | "ranked"
  | "casual_aral"
  | "blitz_pvp_ranked"
  | "5v5_bots_solo"
  | "blitz_bots_solo"
  | "solo_bots"
  | null;
export type RankTier =
  | "初出茅庐"
  | "逐步成长"
  | "铜头铁臂"
  | "值得一战"
  | "深藏不露"
  | "名不虚传"
  | "炉火纯青"
  | "神乎其技"
  | "登峰造极"
  | "至尊荣耀";

export interface Player {
  id: string;
  /** the name in game */
  handle: string;
  level: number;
  reputation: ReputationLevel;
  state: "online" | "offline" | "matching" | "gaming" | "recording";
  rankTier: RankTier;
  region?: string;
  lobby?: Lobby;
  player_handle?: string | null;
  activated: boolean;
  player_uuid: string;
  /** the name in platform */
  nickname?: string | null;
  query_pending_match?:
    | {
        response: 1 | 0;
        playerUUID: string;
      }[]
    | null;
}

export interface MatchStats {
  onlineTotal: number;
  idleCount: number;
  gaming3v3: number;
  matching5v5Ranked: number;
  matching3v3: number;
  gaming5v5: number;
  matchingAral: number;
  gamingAral: number;
  matchingBlitz: number;
  gamingBlitz: number;
}

export interface Room {
  id: string;
  codePrefix: string;
  ownerId: string;
  members: Player[];
  mode: Lobby;
  createdAt: number;
}

export type AppTab = "home" | "install" | "rooms" | "leaderboard" | "profile";
