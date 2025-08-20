import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Bell, User } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface HeaderProps {
  user?: {
    name: string;
    role: string;
  };
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const { toggleSidebar } = useAppContext();

  return (
    <header className="bg-[hsl(var(--primary))] text-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-white hover:opacity-90"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">MK</span>
            </div>
            <h1 className="text-xl font-bold">Umkhonto weSizwe Party</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-white hover:opacity-90">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <div className="text-sm">
              <div className="font-medium">{user?.name || 'Guest'}</div>
              <div className="text-green-200 text-xs">{user?.role || 'Member'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;