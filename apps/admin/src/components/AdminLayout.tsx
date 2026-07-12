import { NavLink, Outlet } from 'react-router';
import { LayoutDashboard, Users, ScrollText, LogOut, Shield, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/context/AdminAuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/accounts', label: 'Accounts', icon: Users },
  { to: '/audit', label: 'Audit Log', icon: ScrollText },
  { to: '/moderation', label: 'Moderation', icon: Shield },
  { to: '/feature-flags', label: 'Feature Flags', icon: Flag },
];

export function AdminLayout() {
  const { user, logout } = useAdminAuth();

  return (
    <div className="min-h-screen flex bg-[#0B132B] text-white">
      <aside className="w-64 border-r border-[#2EC4B6]/20 bg-[#1C2541] flex flex-col">
        <div className="p-6 border-b border-[#2EC4B6]/20">
          <div className="flex items-center gap-2 text-[#2EC4B6] font-semibold text-lg">
            <Shield className="w-5 h-5" />
            Fenix Admin
          </div>
          <p className="text-xs text-slate-400 mt-2">Internal operations portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-[#2EC4B6]/15 text-[#2EC4B6]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2EC4B6]/20 space-y-3">
          <div className="text-xs text-slate-400">
            <div className="text-white truncate">{user?.displayName ?? user?.email}</div>
            <div>{user?.role}</div>
          </div>
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
