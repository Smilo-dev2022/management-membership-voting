import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Header from './Header';
import OfficeNavigation from './OfficeNavigation';
import CommunicationTools from './CommunicationTools';
import VotingSystem from './VotingSystem';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import MemberManagement from './MemberManagement';
import MembershipManagement from './MembershipManagement';
import Analytics from './Analytics';
import Settings from './Settings';
import PaymentSystem from './PaymentSystem';
import KnowledgeBase from './KnowledgeBase';

const AppLayout: React.FC = () => {
  const { sidebarOpen } = useAppContext();
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const [user] = useState({
    name: 'Admin User',
    role: 'branch'
  });

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard userRole={user.role} />;
      case 'members':
        return <MemberManagement />;
      case 'offices':
        return <OfficeNavigation onNavigate={handleNavigate} />;
      case 'communications':
        return <CommunicationTools />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'voting':
        return <VotingSystem />;
      case 'payments':
        return <PaymentSystem />;
      case 'documents':
        return <div className="p-6"><h2 className="text-2xl font-bold">Document Management</h2><p>Coming soon...</p></div>;
      case 'analytics':
        return <Analytics userRole={user.role} />;
      case 'settings':
        return <Settings userRole={user.role} />;
      default:
        return <Dashboard userRole={user.role} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <div className="flex">
        <Sidebar 
          userRole={user.role} 
          onNavigate={handleNavigate} 
          currentPage={currentPage} 
        />
        <main className={`flex-1 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;