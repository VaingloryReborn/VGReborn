import { MitmLogEntry } from "../types";
import { updateUser } from "../services/userService";

export async function handleAction(
  action: string,
  user: Record<string, any>,
  body: Record<string, unknown>,
  entry: MitmLogEntry,
) {
  if (action === "startSessionForPlayer") {
    const returnValue = body.returnValue as Record<string, unknown> | undefined;
    const sessionToken = body.sessionToken as string;
    const patch: Record<string, unknown> = {
      state: "online",
      activated: true,
    };
    patch.session_token = sessionToken;
    if (returnValue && typeof returnValue === "object") {
      if ("country" in returnValue) {
        patch.country = returnValue.country;
      }
      if ("region" in returnValue) {
        patch.region = returnValue.region;
      }
      if ("playerUUID" in returnValue) {
        patch.player_uuid = returnValue.playerUUID;
      }

      await updateUser(user, patch);
    }
  } else if (action === "update") {
    const returnValue = body.returnValue as Record<string, unknown> | undefined;
    if (returnValue?.state === "menus" && user.state === "offline") {
      await updateUser(user, { state: "online", activated: true });
      return;
    }
    if (returnValue?.state === "playing") {
      await updateUser(user, { state: "gaming" });
      return;
    }
  } else if (action === "joinLobby") {
    const patch: Record<string, unknown> = { state: "matching" };
    const reqBody = entry.req_body as
      | Record<string, unknown>
      | null
      | undefined;

    if (reqBody && Array.isArray(reqBody.params) && reqBody.params.length > 1) {
      try {
        const param1 = reqBody.params[1];
        if (typeof param1 === "string") {
          const parsed = JSON.parse(param1);
          if (parsed && typeof parsed === "object") {
            if ("lobby" in parsed) {
              if (parsed.lobby === "5v5_pvp_casual") {
                // 5v5 casual is not support
                return;
              }
              patch.lobby = parsed.lobby;
            }
            if ("playerHandle" in parsed) {
              patch.player_handle = parsed.playerHandle;
            }
          }
        }
      } catch (e) {
        console.error("Error parsing joinLobby params", e);
      }
    }
    await updateUser(user, patch);
  } else if (action === "queryPendingMatch") {
    const returnValue = body.returnValue as Record<string, unknown> | undefined;
    if (returnValue && typeof returnValue === "object") {
      const isValid = returnValue.isValid === true;
      if (isValid) {
        await updateUser(user, {
          query_pending_match: returnValue.responses,
          state: "matching",
        });
      } else {
        await updateUser(user, {
          query_pending_match: null,
          state: "online",
        });
      }
    }
  } else if (action === "friendListAll") {
    await updateUser(user, { state: "gaming" });
  } else if (action === "recordMatchExperienceMetrics") {
    await updateUser(user, {
      state: "recording",
      lobby: null,
    });
  } else if (action === "getPlayerInfo") {
    await updateUser(user, { state: "online" });
  } else if (action === "exitLobby") {
    await updateUser(user, {
      state: "online",
      lobby: null,
      player_handle: null,
    });
  } else if (action === "endSession") {
    await updateUser(user, { state: "offline" });
  } else if (action === "renamePlayerHandle") {
    const returnValue = body.returnValue as Record<string, unknown> | undefined;
    if (
      returnValue &&
      typeof returnValue === "object" &&
      "handle" in returnValue
    ) {
      await updateUser(user, { handle: returnValue.handle });
    }
  }
}
