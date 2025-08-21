import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  MapPin, 
  MessageSquare, 
  Vote, 
  FileText, 
  BarChart3,
  Settings,
  CreditCard,
  BookOpen
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface SidebarProps {
  userRole?: string;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, onNavigate, currentPage }) => {
  const { sidebarOpen } = useAppContext();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'iec', label: 'IEC Data', icon: MapPin },
      { id: 'offices', label: 'Office Navigation', icon: MapPin },
      { id: 'members', label: 'Members', icon: Users },
      { id: 'communications', label: 'Communications', icon: MessageSquare },
      { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
      { id: 'voting', label: 'Voting', icon: Vote },
      { id: 'payments', label: 'Payments', icon: CreditCard },
    ];

    // Add role-specific items
    const roleSpecificItems: Array<{ id: string; label: string; icon: any }> = [];
    if (userRole === 'national') {
      roleSpecificItems.push(
        { id: 'analytics', label: 'National Analytics', icon: BarChart3 },
        { id: 'reports', label: 'Reports Export', icon: FileText }
      );
    } else if (userRole === 'province') {
      roleSpecificItems.push(
        { id: 'approvals', label: 'Approvals', icon: FileText }
      );
    }

    return [...baseItems, ...roleSpecificItems, { id: 'settings', label: 'Settings', icon: Settings }];
  };

  const menuItems = getMenuItems();

  if (!sidebarOpen) return null;

  return (
    <aside className="bg-[hsl(var(--accent))] text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-yellow-600"
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

