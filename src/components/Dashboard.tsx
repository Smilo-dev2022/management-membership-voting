import React from 'react';
import NationalDashboard from './dashboards/NationalDashboard';
import ProvinceDashboard from './dashboards/ProvinceDashboard';
import RegionDashboard from './dashboards/RegionDashboard';
import BranchDashboard from './dashboards/BranchDashboard';
import VDDashboard from './dashboards/VDDashboard';
import HierarchyNavigation from './HierarchyNavigation';
import ActivityLog from './ActivityLog';

interface DashboardProps {
  userRole: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const handleNavigate = (level: string, id: string) => {
    // Update URL hash for simple deep-linking within the single route app
    const hash = `#${level}${id ? `/${id}` : ''}`;
    try {
      window.location.hash = hash;
    } catch (_e) {
      // no-op in non-browser environments
    }
  };

  const renderDashboard = () => {
    switch (userRole) {
      case 'national':
        return <NationalDashboard />;
      case 'province':
        return <ProvinceDashboard />;
      case 'region':
        return <RegionDashboard />;
      case 'branch':
        return <BranchDashboard />;
      case 'vd':
        return <VDDashboard />;
      default:
        return <BranchDashboard />; // Default fallback
    }
  };

  return (
    <div className="space-y-6">
      <HierarchyNavigation currentLevel={userRole} onNavigate={handleNavigate} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2">
          {renderDashboard()}
        </div>
        <div className="lg:col-span-1">
          <ActivityLog userRole={userRole} limit={10} />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;