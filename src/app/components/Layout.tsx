import { Outlet, Link, useLocation } from "react-router";
import { Home, BookOpen, PlusCircle, User } from "lucide-react";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "首页" },
    { path: "/books", icon: BookOpen, label: "书籍" },
    { path: "/publish", icon: PlusCircle, label: "上架" },
    { path: "/profile", icon: User, label: "我的" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-md mx-auto">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? "text-purple-600" : "text-gray-600"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
