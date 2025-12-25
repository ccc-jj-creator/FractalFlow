import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, Globe, PlusSquare } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Studio', path: '/studio', icon: <PlusSquare size={20} /> },
    { name: 'Explore', path: '/explore', icon: <Globe size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation (Desktop) / Bottom Bar (Mobile) */}
      <nav className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex md:flex-col justify-between md:h-screen fixed z-50 md:sticky top-0 bottom-0 md:bottom-auto">
        <div className="p-4 md:p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="text-white fill-current" size={18} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 hidden md:block">
            FractalFlow
          </span>
        </div>

        <div className="flex flex-row md:flex-col flex-1 justify-around md:justify-start px-2 md:px-4 gap-1 md:gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col md:flex-row items-center md:px-4 md:py-3 p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                }`}
              >
                {item.icon}
                <span className="text-xs md:text-sm md:ml-3 mt-1 md:mt-0 font-medium">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
        
        <div className="hidden md:block p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3">
             <img src="https://picsum.photos/32/32" alt="User" className="w-8 h-8 rounded-full ring-2 ring-zinc-700" />
             <div className="text-sm">
                <p className="font-medium">Creator</p>
                <p className="text-zinc-500 text-xs">Pro Plan</p>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
