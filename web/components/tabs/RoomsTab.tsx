import React, { useState } from "react";
import {
  Plus,
  Users,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { Room, Player } from "../../types";
import RoomCard from "../RoomCard";
import CreateRoomGuideModal from "../CreateRoomGuideModal";

interface RoomsTabProps {
  rooms: Room[];
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  user: Player | null;
  onOpenLogin: () => void;
}

const RoomsTab: React.FC<RoomsTabProps> = ({
  rooms,
  selectedRoom,
  setSelectedRoom,
  user,
  onOpenLogin,
}: RoomsTabProps) => {
  const [isGuideOpen, setGuideOpen] = useState(false);

  const getReputationColor = (rep: string) => {
    if (rep === "优") return "text-emerald-400";
    if (rep === "一般") return "text-amber-400";
    return "text-rose-400";
  };

  const handleJoinRoom = (room: Room) => {
    if (!user) {
      onOpenLogin();
      return;
    }
    setSelectedRoom({ ...room, members: [...room.members, user] });
  };

  if (selectedRoom) {
    return (
      <div className="p-5 pb-24 min-h-screen relative z-10 animate-in slide-in-from-right-4 duration-300">
        <button
          onClick={() => setSelectedRoom(null)}
          className="flex items-center gap-1 text-slate-400 mb-6 active:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回列表</span>
        </button>

        <div className="glass-panel p-6 rounded-2xl mb-6 border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-red-900/20 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-red-900/30">
                  {selectedRoom.mode}
                </span>
                <h2 className="text-xl font-bold text-white">
                  {selectedRoom.codePrefix}
                </h2>
              </div>
              <p className="text-xs text-slate-500">ID: {selectedRoom.id}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white">
                {selectedRoom.members.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-8">
            {selectedRoom.members.map((member, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold border border-white/10 text-white">
                    LV{member.level}
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-1.5 text-white">
                      {member.handle}
                      {member.id === selectedRoom.ownerId && (
                        <ShieldCheck className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      信誉:{" "}
                      <span className={getReputationColor(member.reputation)}>
                        {member.reputation}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.state === "matching" && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      已准备
                    </span>
                  )}
                  {member.state === "matching" && (
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-500 text-[10px] font-bold">
                      未就绪
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button className="flex-1 py-4 bg-emerald-600 rounded-xl font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-white">
              准备就绪
            </button>
            <button
              onClick={() => setSelectedRoom(null)}
              className="px-6 py-4 bg-white/5 rounded-xl text-slate-400 font-bold active:bg-rose-500/20 transition-all"
            >
              退出
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 pb-24 relative z-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gradient italic">房间大厅</h2>
        <button 
          onClick={() => setGuideOpen(true)}
          className="p-2 bg-red-800 rounded-lg shadow-lg active:scale-90 transition-all text-white"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 opacity-60">
          <Users className="w-12 h-12 mb-4" />
          <p className="text-sm font-medium">当前没有房间</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onClick={handleJoinRoom} />
          ))}
        </div>
      )}

      <CreateRoomGuideModal isOpen={isGuideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
};

export default RoomsTab;
