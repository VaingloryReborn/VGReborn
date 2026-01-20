export type ReputationLevel = "优" | "一般" | "差";

export type Lobby =
  | "5v5_pvp_ranked"
  | "5v5_pvp_casual"
  | "3v3_pvp_ranked"
  | "3v3_pvp_casual"
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
  handle: string;
  level: number;
  reputation: ReputationLevel;
  state: "online" | "offline" | "matching" | "gaming" | "recording";
  rankTier: RankTier;
  region?: string;
  lobby?: Lobby;
  player_handle?: string | null;
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
  name: string;
  ownerId: string;
  members: Player[];
  maxMembers: number;
  mode: "3v3" | "5v5 Ranked" | "Brawl" | "Blitz";
  createdAt: number;
}

export type AppTab = "home" | "install" | "rooms" | "leaderboard" | "profile";
