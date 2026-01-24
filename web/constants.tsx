import { MatchStats, Player, Room } from "./types";

export const MOCK_STATS: MatchStats = {
  onlineTotal: 0,
  idleCount: 0,
  gaming3v3: 0,
  matching3v3: 0,
  matching5v5Ranked: 0,
  gaming5v5: 0,
  matchingAral: 0,
  gamingAral: 0,
  matchingBlitz: 0,
  gamingBlitz: 0,
};

export const MOCK_USER: Player = {
  id: "vg-player-000",
  player_uuid: "uuid-000",
  handle: "NewPlayer",
  level: 1,
  reputation: "excellent",
  state: "offline",
  rankTier: "t1",
  activated: true,
};

export const MOCK_LEADERBOARD_3V3: Player[] = [];
export const MOCK_LEADERBOARD_5V5: Player[] = [];

// Fallback for any legacy code still looking for MOCK_LEADERBOARD
export const MOCK_LEADERBOARD: Player[] = [];

export const MOCK_ROOMS: Room[] = [];

// Using the provided Reddit source URL for the Vainglory CE banner background
import vgBackground from "./assets/images/vgce.webp";
export const VG_BACKGROUND = vgBackground;
