import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Calendar, MessageSquare, BarChart3, MapIcon } from 'lucide-react';

const RegionDashboard: React.FC = () => {
  const kpis = [
    { title: 'Members in Region', value: '3,456', icon: Users, color: 'text-blue-600' },
    { title: 'Active Branches', value: '8', icon: MapPin, color: 'text-green-600' },
    { title: 'Events', value: '4', icon: Calendar, color: 'text-purple-600' },
  ];

  const quickActions = [
    'Send Regional Messages',
    'View Branch Reports'
  ];

  const widgets = [
    { title: 'Regional Mobilisation Heatmap', status: 'Active' },
    { title: 'Task Tracker', count: 12 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Region Dashboard</h2>
        <p className="text-gray-600">Dashboard for regional leaders to manage branches and oversee VDs</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action, index) => (
              <Button key={index} variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                {action}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Widgets */}
        <Card>
          <CardHeader>
            <CardTitle>Widgets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {widgets.map((widget, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{widget.title}</span>
                <span className="font-semibold">{widget.count || widget.status}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Branch List with Performance Stats
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegionDashboard;