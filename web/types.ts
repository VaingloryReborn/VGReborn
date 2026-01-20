export type ReputationLevel = "优" | "一般" | "差";

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
  name: string;
  level: number;
  reputation: ReputationLevel;
  state: "online" | "offline" | "matching" | "gaming" | "accepted";
  rankTier: RankTier;
}

export interface MatchStats {
  onlineTotal: number;
  idleCount: number;
  gaming3v3: number;
  matching5v5Ranked: number;
  matching3v3: number;
  gaming5v5: number;
  matchingBrawl: number;
  gamingBrawl: number;
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
