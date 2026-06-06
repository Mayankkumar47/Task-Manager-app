import React from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
      {/* System Status Node */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
          Core Cluster Operational
        </span>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
        <div className="text-right">
          <p className="text-xs font-bold text-slate-200">{currentUser?.name || "Sonam"}</p>
          <p className="text-[10px] font-mono text-slate-500">{currentUser?.email || "user@node.io"}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-500/10">
          {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "S"}
        </div>
      </div>
    </header>
  );
};

export default Navbar;