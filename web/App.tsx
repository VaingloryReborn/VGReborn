import React, { useState } from 'react';
import { AppTab, Room } from './types';
import { MOCK_ROOMS } from './constants';
import LoginModal from './components/LoginModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import BottomNav from './components/layout/BottomNav';

// Separate Tab Components
import HomeTab from './components/tabs/HomeTab';
import InstallTab from './components/tabs/InstallTab';
import RoomsTab from './components/tabs/RoomsTab';
import LeaderboardTab from './components/tabs/LeaderboardTab';
import ProfileTab from './components/tabs/ProfileTab';
import DynamicIsland from './components/DynamicIsland';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  
  const { user, isAuthLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setActiveTab('home');
  };

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    if (tab !== 'rooms') {
      setSelectedRoom(null);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative shadow-2xl overflow-hidden bg-[#0f111a]">
      <DynamicIsland user={user} />
      <main className="relative z-10">
        {activeTab === 'home' && <HomeTab onJoinClick={() => setActiveTab('install')} />}
        {activeTab === 'install' && <InstallTab />}
        {activeTab === 'rooms' && (
          <RoomsTab 
            rooms={rooms} 
            selectedRoom={selectedRoom} 
            setSelectedRoom={setSelectedRoom} 
            user={user} 
            onOpenLogin={() => setLoginModalOpen(true)}
          />
        )}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
        {activeTab === 'profile' && (
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
      <AppContent />
    </AuthProvider>
  );
};

export default App;
