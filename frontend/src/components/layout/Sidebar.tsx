import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  FileText,
  DollarSign,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const menuItems = [
  { label: 'HOME', path: '/dashboard', icon: LayoutDashboard },
  { label: 'DOCUMENT TRACKER', path: '/document-tracker', icon: FileText },
  { label: 'ACCOUNTING & CASH', path: '/accounting-cash', icon: DollarSign },
  { label: 'ALTERNATIVE DATA', path: '/alternative-data', icon: BarChart3 },
];

export const Sidebar = ({ isOpen, onClose, onToggle }: SidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/' || location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  /* Collapsed: narrow teal strip (desktop only), icons only */
  const collapsedStrip = (
    <aside className="hidden md:flex flex-col w-16 shrink-0 bg-primary text-white">
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-14 hover:bg-primary-light/20"
        aria-label="Expand sidebar"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <nav className="flex-1 py-2 flex flex-col items-center gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center w-12 h-12 rounded transition ${
                isActive(item.path) ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  /* Expanded: light grey sidebar, teal active (mockup canonical) */
  const expandedSidebar = (
    <aside className="flex flex-col w-64 shrink-0 bg-ale-sidebar border-r border-neutral-200">
      <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-200">
        <button
          onClick={onToggle}
          className="p-2 rounded hover:bg-ale-sidebar-active text-neutral-600"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded hover:bg-ale-sidebar-active text-neutral-600"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded transition ${
                active
                  ? 'bg-ale-sidebar-active text-primary font-semibold'
                  : 'text-neutral-700 hover:bg-neutral-200/80'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-primary' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-neutral-200 px-4 py-3">
        <p className="text-xs text-neutral-500">© 2026 ALE</p>
      </div>
    </aside>
  );

  /* Desktop closed => collapsed strip; mobile closed => nothing */
  if (!isOpen) {
    return <>{collapsedStrip}</>;
  }

  /* Desktop open => expanded sidebar; mobile open => overlay + drawer */
  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed left-0 top-0 h-screen z-50 w-64 md:relative md:flex">
        {expandedSidebar}
      </div>
    </>
  );
};
