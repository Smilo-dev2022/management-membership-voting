import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Vote, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';

const NationalDashboard: React.FC = () => {
  const kpis = [
    { title: 'Total Members', value: '125,456', icon: Users, color: 'text-blue-600' },
    { title: 'Active Provinces', value: '9', icon: MapPin, color: 'text-green-600' },
    { title: 'Events', value: '23', icon: Calendar, color: 'text-purple-600' },
    { title: 'Ongoing Votes', value: '5', icon: Vote, color: 'text-orange-600' },
  ];

  const quickActions = [
    'Broadcast Messaging',
    'National Reports Export',
    'Province Management',
    'Event Coordination'
  ];

  const widgets = [
    { title: 'Upcoming National Events', count: 8 },
    { title: 'Alerts', count: 3 },
    { title: 'Voting Oversight', count: 12 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">National Office Dashboard</h2>
        <p className="text-gray-600">Main control panel with access to all provinces, regions, branches, and VDs</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <span className="font-semibold">{widget.count}</span>
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
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Province List with Search/Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NationalDashboard;