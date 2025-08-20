import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, MapPin, TrendingUp, AlertCircle, CheckCircle, Clock, UserCheck } from 'lucide-react';

const BranchDashboard: React.FC = () => {
  // Enhanced mock data with VD breakdown
  const branchData = {
    totalMembers: 1247,
    activeMembers: 1156,
    pendingVerifications: 23,
    inactiveMembers: 68,
    vds: [
      { id: 'VD001', name: 'VD 001', members: 156, active: 142, coordinator: 'John Smith', performance: 91 },
      { id: 'VD002', name: 'VD 002', members: 143, active: 138, coordinator: 'Mary Johnson', performance: 96 },
      { id: 'VD003', name: 'VD 003', members: 189, active: 175, coordinator: 'David Wilson', performance: 93 },
      { id: 'VD004', name: 'VD 004', members: 134, active: 121, coordinator: 'Sarah Davis', performance: 90 },
      { id: 'VD005', name: 'VD 005', members: 167, active: 155, coordinator: 'Mike Brown', performance: 93 },
      { id: 'VD006', name: 'VD 006', members: 178, active: 162, coordinator: 'Lisa Garcia', performance: 91 },
      { id: 'VD007', name: 'VD 007', members: 145, active: 134, coordinator: 'Tom Anderson', performance: 92 },
      { id: 'VD008', name: 'VD 008', members: 135, active: 129, coordinator: 'Emma Taylor', performance: 96 }
    ],
    electionReadiness: {
      volunteerCoverage: 87,
      memberEngagement: 92,
      coordinatorTraining: 100
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 95) return 'bg-green-500';
    if (performance >= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 95) return 'Excellent';
    if (performance >= 90) return 'Good';
    return 'Needs Attention';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-700">Branch Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-green-600">{branchData.totalMembers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-blue-600">{branchData.activeMembers}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-2xl font-bold text-yellow-600">{branchData.pendingVerifications}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Members</p>
                <p className="text-2xl font-bold text-red-600">{branchData.inactiveMembers}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* VD Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            VD Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branchData.vds.map((vd) => (
              <div key={vd.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{vd.name}</h4>
                    <p className="text-sm text-gray-600">{vd.coordinator}</p>
                  </div>
                  <Badge variant="secondary" className={getPerformanceColor(vd.performance)}>
                    {getPerformanceBadge(vd.performance)}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Members: {vd.active}/{vd.members}</span>
                    <span>{vd.performance}%</span>
                  </div>
                  <Progress value={vd.performance} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Election Readiness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Election Readiness Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-1">Volunteer Coverage</h4>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {branchData.electionReadiness.volunteerCoverage}%
              </div>
              <Progress value={branchData.electionReadiness.volunteerCoverage} className="h-2" />
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-1">Member Engagement</h4>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {branchData.electionReadiness.memberEngagement}%
              </div>
              <Progress value={branchData.electionReadiness.memberEngagement} className="h-2" />
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-1">Coordinator Training</h4>
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {branchData.electionReadiness.coordinatorTraining}%
              </div>
              <Progress value={branchData.electionReadiness.coordinatorTraining} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchDashboard;