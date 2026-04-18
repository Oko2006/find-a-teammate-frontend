import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  LogOut,
  Search,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import wordmark from '../../assets/wordmark.png';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-surface border-b border-border px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-grow">
        {/* Mobile Menu Placeholder */}
        <button className="md:hidden p-2 text-text-muted">
          <Menu className="w-6 h-6" />
        </button>

        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="FindATeammate logo"
            className="w-9 h-9 rounded-xl shadow-main"
          />
          <img
            src={wordmark}
            alt="FindATeammate"
            className="hidden sm:block h-6"
          />
        </Link>
        
        <div className="hidden md:flex relative w-full max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search for projects, tech stacks, or skills..."
            className="w-full bg-background rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 border-none outline-none transition-all placeholder:text-text-muted"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <>
            <button className="text-text-muted hover:text-primary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border-2 border-surface"></span>
            </button>
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  {user?.fullName?.split(' ').map(part => part[0]).join('').slice(0, 2)}
                </div>
                <span className="hidden md:block text-sm font-bold text-text-main">{user?.fullName}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-text-muted hover:text-red-500 transition-colors ml-2"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-text-muted hover:text-primary">Log in</Link>
            <Link to="/register" className="btn-primary">Join Now</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
