import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Player } from "../types";
import { MOCK_USER } from "../constants";

interface AuthContextType {
  user: Player | null;
  isAuthLoading: boolean;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<Player | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Player | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let profileSubscription: any = null;

    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        setUser((prev) => ({
          ...prev!,
          ...MOCK_USER, // keep defaults
          id: userId,
          handle: data.handle || prev?.handle || "指挥官",
          state: data.state,
          region: data.region,
          lobby: data.lobby,
          player_handle: data.player_handle,
          activated: data.activated,
        }));
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Initial setup with basic info
        setUser({
          ...MOCK_USER,
          id: session.user.id,
          name: session.user.email?.split("@")[0] || "指挥官",
        });

        // Fetch real profile
        fetchProfile(session.user.id);

        // Subscribe to profile changes
        profileSubscription = supabase
          .channel("public:profiles")
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "profiles",
              filter: `id=eq.${session.user.id}`,
            },
            (payload) => {
              console.log("Profile updated:", payload);
              const newData = payload.new;
              setUser((prev) =>
                prev
                  ? {
                      ...prev,
                      state: newData.state || prev.state,
                      handle: newData.handle || prev.handle,
                      region: newData.region || prev.region,
                      lobby: newData.lobby || prev.lobby,
                      player_handle: newData.player_handle || prev.player_handle,
                      activated: newData.activated || prev.activated,
                    }
                  : null,
              );
            },
          )
          .subscribe();
      }
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Update basic info if needed
        setUser((prev) => {
          if (prev?.id === session.user.id) return prev;
          return {
            ...MOCK_USER,
            id: session.user.id,
            name: session.user.email?.split("@")[0] || "指挥官",
          };
        });

        // Re-subscribe if user changes (or initial login)
        if (!profileSubscription) {
          fetchProfile(session.user.id);
          profileSubscription = supabase
            .channel("public:profiles")
            .on(
              "postgres_changes",
              {
                event: "UPDATE",
                schema: "public",
                table: "profiles",
                filter: `id=eq.${session.user.id}`,
              },
              (payload) => {
                console.log("Profile updated:", payload);
                const newData = payload.new;
                setUser((prev) =>
                  prev
                    ? {
                        ...prev,
                        state: newData.state || prev.state,
                        handle: newData.handle || prev.handle,
                        lobby: newData.lobby || prev.lobby,
                        player_handle: newData.player_handle || prev.player_handle,
                        activated: newData.activated || prev.activated,
                      }
                    : null,
                );
              },
            )
            .subscribe();
        }
      } else {
        setUser(null);
        if (profileSubscription) {
          supabase.removeChannel(profileSubscription);
          profileSubscription = null;
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      if (profileSubscription) {
        supabase.removeChannel(profileSubscription);
      }
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthLoading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
