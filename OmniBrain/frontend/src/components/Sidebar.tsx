import { NavLink, useNavigate } from "react-router-dom";
import {
  Brain,
  LayoutDashboard,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  BarChart3,
  UserCircle,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/chat", icon: MessageSquare, label: "Chat" },
  { to: "/documents", icon: FileText, label: "Documents" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen sticky top-0 shadow-2xl shadow-black/10">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <div>
          <span className="text-xl font-bold">OmniBrain</span>
          <p className="text-xs text-slate-500 -mt-0.5">Enterprise AI</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/30 shadow-lg shadow-primary/10"
                  : "text-slate-300 hover:bg-card hover:text-white"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="px-3 py-4 bg-card/40 rounded-xl mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.full_name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-300 hover:bg-error/10 hover:text-error rounded-xl transition-all duration-200 font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
