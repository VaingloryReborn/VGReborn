import React, { useState, useEffect } from "react";
import { AppTab, Room } from "./types";
import LoginModal from "./components/LoginModal";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import BottomNav from "./components/layout/BottomNav";
import servers from "./assets/ea-servers.json";
import { AlertCircle, X } from "lucide-react";
import { supabase } from "./supabase";

// Separate Tab Components
import HomeTab from "./components/tabs/HomeTab";
import InstallTab from "./components/tabs/InstallTab";
import RoomsTab from "./components/tabs/RoomsTab";
import LeaderboardTab from "./components/tabs/LeaderboardTab";
import ProfileTab from "./components/tabs/ProfileTab";
import DynamicIsland from "./components/DynamicIsland";

import { useRooms } from "./hooks/useRooms";

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const rooms = useRooms();

  const { user, isAuthLoading, logout } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch("https://health.vgreborn.com/", {
          method: "HEAD",
          signal: controller.signal,
          mode: "no-cors",
        });

        clearTimeout(timeoutId);
        setConnectionError(false);
        setShowErrorBanner(false);
      } catch (error) {
        console.error("Middle server connection failed:", error);
        setConnectionError(true);
        setShowErrorBanner(true);
        const interval = setTimeout(() => {
          checkConnection();
        }, 10000);
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    if (showErrorBanner) {
      const timer = setTimeout(() => setShowErrorBanner(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showErrorBanner]);

  const handleLogout = async () => {
    await logout();
    setActiveTab("home");
  };

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    if (tab !== "rooms") {
      setSelectedRoom(null);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative shadow-2xl overflow-hidden bg-[#0f111a]">
      {showErrorBanner && (
        <div className="absolute top-0 left-0 right-0 z-[60] bg-red-500 bg-opacity-70 text-white px-4 py-3 flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium">
              中间服务器连接失败，请检查网络
            </span>
          </div>
          <button
            onClick={() => setShowErrorBanner(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <DynamicIsland user={user} />
      <main className="relative z-10">
        {activeTab === "home" && (
          <HomeTab onJoinClick={() => setActiveTab("install")} />
        )}
        {activeTab === "install" && (
          <InstallTab onOpenLogin={() => setLoginModalOpen(true)} />
        )}
        {activeTab === "rooms" && (
          <RoomsTab
            rooms={rooms}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            user={user}
            onOpenLogin={() => setLoginModalOpen(true)}
          />
        )}
        {activeTab === "leaderboard" && <LeaderboardTab />}
        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            isAuthLoading={isAuthLoading}
            onOpenLogin={() => setLoginModalOpen(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={() => setLoginModalOpen(false)}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
