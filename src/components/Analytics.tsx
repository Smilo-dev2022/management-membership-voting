import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Vote, FileText, Download, DollarSign, CreditCard, HandHeart } from 'lucide-react';

interface AnalyticsProps {
  userRole: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ userRole }) => {
  const getRoleSpecificAnalytics = () => {
    switch (userRole) {
      case 'national':
        return {
          title: 'National Analytics Dashboard',
          metrics: [
            { label: 'Total Members', value: '2.5M', change: '+12%', icon: Users },
            { label: 'Active Provinces', value: '9/9', change: '100%', icon: TrendingUp },
            { label: 'Total Regions', value: '52/52', change: '100%', icon: Vote },
            { label: 'Total Branches', value: '234/234', change: '100%', icon: FileText }
          ]
        };
      case 'province':
        return {
          title: 'Provincial Analytics Dashboard',
          metrics: [
            { label: 'Provincial Members', value: '285K', change: '+8%', icon: Users },
            { label: 'Active Regions', value: '12/12', change: '100%', icon: TrendingUp },
            { label: 'Total Branches', value: '45/45', change: '100%', icon: Vote },
            { label: 'Total VDs', value: '285/300', change: '95%', icon: FileText }
          ]
        };
      case 'region':
        return {
          title: 'Regional Analytics Dashboard',
          metrics: [
            { label: 'Regional Members', value: '45K', change: '+6%', icon: Users },
            { label: 'Active Branches', value: '8/8', change: '100%', icon: TrendingUp },
            { label: 'Total VDs', value: '48/52', change: '92%', icon: Vote },
            { label: 'Monthly Reports', value: '12', change: '+3%', icon: FileText }
          ]
        };
      case 'branch':
        return {
          title: 'Branch Analytics Dashboard',
          metrics: [
            { label: 'Branch Members', value: '8.2K', change: '+4%', icon: Users },
            { label: 'Active VDs', value: '6/8', change: '75%', icon: TrendingUp },
            { label: 'VD Performance', value: '85%', change: '+5%', icon: Vote },
            { label: 'Weekly Reports', value: '4', change: '+1%', icon: FileText }
          ]
        };
      default:
        return {
          title: 'Analytics Dashboard',
          metrics: [
            { label: 'Local Members', value: '15K', change: '+5%', icon: Users },
            { label: 'Active Units', value: '8/10', change: '80%', icon: TrendingUp },
            { label: 'Recent Votes', value: '5', change: '+2%', icon: Vote },
            { label: 'Reports', value: '3', change: '+1%', icon: FileText }
          ]
        };
    }
  };
  const getFinancialMetrics = () => {
    switch (userRole) {
      case 'national':
        return [
          { label: 'Total Contributions', value: 'R125.8M', change: '+18%', icon: DollarSign },
          { label: 'Membership Fees (R10+ min)', value: 'R82.4M', change: '+12%', icon: CreditCard },
          { label: 'Donations Received', value: 'R43.4M', change: '+25%', icon: HandHeart }
        ];
      case 'province':
        return [
          { label: 'Provincial Contributions', value: 'R18.2M', change: '+15%', icon: DollarSign },
          { label: 'Membership Fees (R10+ min)', value: 'R12.8M', change: '+10%', icon: CreditCard },
          { label: 'Local Donations', value: 'R5.4M', change: '+22%', icon: HandHeart }
        ];
      case 'region':
        return [
          { label: 'Regional Contributions', value: 'R4.85M', change: '+12%', icon: DollarSign },
          { label: 'Membership Fees (R10+ min)', value: 'R3.2M', change: '+8%', icon: CreditCard },
          { label: 'Community Donations', value: 'R1.65M', change: '+18%', icon: HandHeart }
        ];
      case 'branch':
        return [
          { label: 'Branch Contributions', value: 'R1.25M', change: '+9%', icon: DollarSign },
          { label: 'VD Membership Fees (R10+ min)', value: 'R850K', change: '+6%', icon: CreditCard },
          { label: 'Local Donations', value: 'R400K', change: '+15%', icon: HandHeart }
        ];
      default:
        return [
          { label: 'Local Contributions', value: 'R250K', change: '+5%', icon: DollarSign },
          { label: 'Membership Fees (R10+ min)', value: 'R180K', change: '+3%', icon: CreditCard },
          { label: 'Community Donations', value: 'R70K', change: '+8%', icon: HandHeart }
        ];
    }
  };

  const analytics = getRoleSpecificAnalytics();
  const financialMetrics = getFinancialMetrics();


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{analytics.title}</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-green-600">
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Financial Contributions Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Contributions & Payments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {financialMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <metric.icon className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">{metric.value}</div>
                <p className="text-xs text-green-600">
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Membership Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Event Attendance</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="flex justify-between">
                <span>Voting Participation</span>
                <span className="font-semibold">85%</span>
              </div>
              <div className="flex justify-between">
                <span>Communication Response</span>
                <span className="font-semibold">62%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Financial Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Payment Collection Rate</span>
                <span className="font-semibold text-green-600">92%</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Growth</span>
                <span className="font-semibold text-green-600">+15%</span>
              </div>
              <div className="flex justify-between">
                <span>Outstanding Fees</span>
                <span className="font-semibold text-orange-600">8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;