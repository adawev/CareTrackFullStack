import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Stethoscope, Users, Activity, LogOut } from "lucide-react";

const nav = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/doctors", label: "Doctors", icon: Stethoscope },
  { path: "/patients", label: "Patients", icon: Users },
  { path: "/diseases", label: "Diseases", icon: Activity },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 shrink-0 flex flex-col bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="text-sm font-semibold text-gray-900">CareTrack</div>
          <div className="text-xs text-gray-400 mt-0.5">Medical Records</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-100">
          <div className="px-3 mb-2">
            <div className="text-sm font-medium text-gray-900">{user?.username}</div>
            <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
          </div>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
