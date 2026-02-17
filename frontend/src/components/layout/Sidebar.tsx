import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'Document Tracker', path: '/document-tracker', icon: '📄' },
  { label: 'Accounting & Cash', path: '/accounting-cash', icon: '💰' },
  { label: 'Alternative Data', path: '/alternative-data', icon: '📈' },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
//if the sidebar is open, show the backdrop and the sidebar drawer, otherwise hide them add animation to drawer on open and close

if(isOpen) {
  return (
    <>
        {/* Backdrop */}
        <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
        />
        {/* Sidebar Drawer */}
        
        <aside
            className={`fixed left-0 top-0 h-screen w-64 bg-secondary text-primary shadow-lg transform transition-transform duration-300 ease-in-out z-50 translate-x-0 md:relative md:translate-x-0 md:block md:bg-white md:text-primary md:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:transition-none`}
        >
            {/* Header - Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-primary-light">
                <h1 className="text-2xl font-bold">ALE</h1>
                <button
                    onClick={onClose}
                    className="md:hidden p-2 hover:bg-primary-light rounded transition"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            {/* Navigation Menu */}
            <nav className="flex-1 px-2 py-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded transition ${
                            location.pathname === item.path 
                                ? 'bg-primary-dark text-primary font-semibold'
                                : 'text-primary/80 hover:bg-primary-light hover:text-dark transition'
                        }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            {/* Footer Info */}
            <div className="border-t border-primary-light px-4 py-4">
                <p className="text-xs text-white/60">
                    © 2026 Application Lifecycle Engine
                </p>
            </div>
        </aside>
    </>
    );
} else {
    return null;
}
}