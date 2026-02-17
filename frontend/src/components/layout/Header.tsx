import { useAuth } from '@/app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header = ({ onToggleSidebar, sidebarOpen }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-40">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Menu Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-primary-light rounded transition"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="text-sm">{user?.username || 'Guest'}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-primary-light rounded flex items-center gap-2 transition"
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
