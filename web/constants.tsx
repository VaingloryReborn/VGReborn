
import { MatchStats, Player, Room } from './types';

export const MOCK_STATS: MatchStats = {
  onlineTotal: 0,
  idleCount: 0,
  gaming3v3: 0,
  matching3v3: 0,
  matching5v5Ranked: 0,
  gaming5v5: 0,
  matchingBrawl: 0,
  gamingBrawl: 0,
  matchingBlitz: 0,
  gamingBlitz: 0,
};

export const MOCK_USER: Player = {
  id: 'vg-player-000',
  name: 'NewPlayer',
  level: 1,
  reputation: '优',
  state: 'offline',
  rankTier: '初出茅庐',
};

export const MOCK_LEADERBOARD_3V3: Player[] = [];
export const MOCK_LEADERBOARD_5V5: Player[] = [];

// Fallback for any legacy code still looking for MOCK_LEADERBOARD
export const MOCK_LEADERBOARD: Player[] = [];

export const MOCK_ROOMS: Room[] = [];

// Using the provided Reddit source URL for the Vainglory CE banner background
export const VG_BACKGROUND = "/assets/images/vgce.webp";
