import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  MessageSquare, 
  Zap, 
  Users, 
  Circle
} from 'lucide-react';
import { cn } from '../../lib/utils';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Browse Projects', path: '/projects', icon: Search },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'AI Planner', path: '/planner', icon: Zap },
    { name: 'Matches', path: '/matches', icon: Users },
  ];

  return (
    <div className="hidden md:flex flex-col w-[240px] bg-sidebar h-screen p-6 text-white fixed left-0 top-0 overflow-hidden">
      <div className="flex items-center gap-2 mb-10 text-secondary font-extrabold text-xl">
        <Circle className="fill-secondary w-5 h-5" />
        <span>FindATeammate</span>
      </div>

      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto" />
    </div>
  );
};

export default Sidebar;
