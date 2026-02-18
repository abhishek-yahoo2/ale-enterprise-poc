import { useAuth } from '@/app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, Anchor } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-40">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Left: collapse + branding (mockup: Northern Trust | Alternatives Lifecycle Engine) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-primary-light/20 rounded transition"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Anchor className="w-8 h-8 text-white/90 shrink-0" aria-hidden />
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
            <span>NORTHERN TRUST</span>
            <span className="text-white/80">|</span>
            <span>Alternatives Lifecycle Engine</span>
          </div>
        </div>

        {/* Right: ALE context + user (mockup: ALE - Data View | SYSTEM) */}
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-sm text-white/95">
            ALE - Data View | SYSTEM
          </span>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-white/90" />
            <span className="text-sm">{user?.username || 'Guest'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-primary-light/20 rounded flex items-center gap-2 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
