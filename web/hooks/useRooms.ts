import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { Room, Player } from "../types";
import { MOCK_USER } from "../constants";

const parseHandle = (handle: string) => {
  // Pattern: Code[-Team]_Name
  // Examples: 3001_Player, 3001-A_Player, 1_Player
  const match = handle.match(/^(\d+)(?:-([ABab]))?_(.+)$/);
  if (!match) return null;
  return {
    code: match[1],
    team: match[2] ? match[2].toUpperCase() : null,
    name: match[3],
  };
};

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("state", "offline");

      if (data) {
        updateRooms(data);
      }
    };

    fetchProfiles();

    const channel = supabase
      .channel("public:room_profiles")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          console.log("Room update received:", payload);
          // Re-fetch to ensure we have the full list and latest state
          // Optimisation: We could handle partial updates, but re-fetching is safer for consistency
          fetchProfiles();
        },
      )
      .subscribe((status) => {
        console.log("Room subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateRooms = (profiles: any[]) => {
    const roomsMap = new Map<string, Room>();

    profiles.forEach((p) => {
      // Use handle or player_handle? Prompt says "handle(game name)"
      // AuthContext uses handle for display.
      const handleToParse = p.handle || "";
      const parsed = parseHandle(handleToParse);

      let code = "1200";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let team = null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let name = handleToParse;

      if (parsed) {
        code = parsed.code;
        team = parsed.team;
        name = parsed.name;
      }

      const mode = p.lobby || "";
      const queryPendingMatch = p.query_pending_match?.length || "";
      const roomId = `room-${code}-${mode}-${queryPendingMatch}`;

      if (!roomsMap.has(roomId)) {
        roomsMap.set(roomId, {
          id: roomId,
          codePrefix: code,
          ownerId: "", // Will be set to the first member found
          members: [],
          mode: mode,
          createdAt: Date.now(), // Just for sorting/display
        });
      }

      const room = roomsMap.get(roomId)!;

      // If no owner yet, set this player as owner (arbitrary, usually first one)
      if (!room.ownerId) {
        room.ownerId = p.id;
      }

      const player: Player = {
        ...MOCK_USER, // Defaults
        id: p.id,
        handle: p.handle || "Unknown",
        state: p.state as Player["state"],
        region: p.region,
        lobby: p.lobby,
        player_handle: p.player_handle,
        nickname: p.nickname,
        // Override derived props if needed
        // Team could be stored in a transient property if needed, but Room doesn't strictly track teams in the array
        // The prompt says "code same users distributed in one room"
      };

      room.members.push(player);
    });

    // Convert map to array and sort
    const roomsArray = Array.from(roomsMap.values());
    roomsArray.sort((a, b) => parseInt(a.codePrefix) - parseInt(b.codePrefix));

    setRooms(roomsArray);
  };

  return rooms;
};
