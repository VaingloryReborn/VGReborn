
import React from 'react';
import { Room } from '../types';
import { Users, Shield, Zap, Sword } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onClick: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  const getModeIcon = () => {
    switch (room.mode) {
      case '5v5 Ranked': return <Shield className="w-4 h-4 text-purple-400" />;
      case '3v3': return <Sword className="w-4 h-4 text-blue-400" />;
      case 'Brawl': return <Zap className="w-4 h-4 text-orange-400" />;
      default: return <Users className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div 
      onClick={() => onClick(room)}
      className="p-4 mb-3 rounded-xl border border-white/10 glass-panel active:scale-[0.98] transition-all cursor-pointer hover:border-purple-500/40"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-slate-300">{room.codePrefix}</span>
          <h3 className="font-bold text-slate-100">{room.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Users className="w-3 h-3" />
          <span>{room.members.length}/{room.maxMembers}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
          {getModeIcon()}
          <span className="text-xs font-medium text-slate-300">{room.mode}</span>
        </div>
        <div className="text-[10px] text-slate-500 italic">
          创建于 {new Date(room.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
