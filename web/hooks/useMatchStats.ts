import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { MatchStats } from '../types';

const INITIAL_STATS: MatchStats = {
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

export const useMatchStats = () => {
  const [stats, setStats] = useState<MatchStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('state, lobby')
          .neq('state', 'offline');

        if (data && isMounted) {
          const newStats = { ...INITIAL_STATS };
          data.forEach((profile) => {
            const s = profile.state;
            const lobby = profile.lobby;
            newStats.onlineTotal++;
            
            if (s === 'online') {
              newStats.idleCount++;
            } else if (s === 'matching') {
              if (lobby === '5v5_pvp_ranked') newStats.matching5v5Ranked++;
              else if (lobby === '3v3_pvp_ranked') newStats.matching3v3++;
              else if (lobby === 'aral_pvp_ranked') newStats.matchingBrawl++;
              else if (lobby === 'blitz_pvp_ranked') newStats.matchingBlitz++;
            } else if (s === 'gaming') {
              if (lobby?.startsWith('5v5')) newStats.gaming5v5++;
              else if (lobby?.startsWith('3v3')) newStats.gaming3v3++;
              else if (lobby === 'aral_pvp_ranked') newStats.gamingBrawl++;
              else if (lobby === 'blitz_pvp_ranked') newStats.gamingBlitz++;
            }
          });
          setStats(newStats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();

    const channel = supabase
      .channel('public:profiles_global_stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: 'state=neq.offline',
        },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { stats, loading };
};
