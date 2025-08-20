import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, CreditCard, Hash, Plus, Search } from 'lucide-react';
import { generateMembershipNumber, formatCurrency, getMembershipFeeTiers, PROVINCE_CODES } from '@/lib/membershipUtils';

interface MembershipManagementProps {
  userRole: string;
}

const MembershipManagement: React.FC<MembershipManagementProps> = ({ userRole }) => {
  const [selectedProvince, setSelectedProvince] = useState('Gauteng');
  const [membershipFee, setMembershipFee] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const feeTiers = getMembershipFeeTiers();
  
  const generateNewMember = () => {
    const membershipNumber = generateMembershipNumber(selectedProvince);
    alert(`New membership number generated: ${membershipNumber.formatted}`);
  };

  const getMembershipStats = () => {
    switch (userRole) {
      case 'national':
        return {
          totalMembers: '11.2M',
          activeMembers: '10.8M',
          pendingApplications: '15.2K',
          averageFee: 'R45'
        };
      case 'province':
        return {
          totalMembers: '1.2M',
          activeMembers: '1.15M',
          pendingApplications: '2.1K',
          averageFee: 'R42'
        };
      case 'region':
        return {
          totalMembers: '185K',
          activeMembers: '178K',
          pendingApplications: '450',
          averageFee: 'R38'
        };
      case 'branch':
        return {
          totalMembers: '28.5K',
          activeMembers: '27.2K',
          pendingApplications: '85',
          averageFee: 'R35'
        };
      default:
        return {
          totalMembers: '5.2K',
          activeMembers: '4.8K',
          pendingApplications: '12',
          averageFee: 'R32'
        };
    }
  };

  const stats = getMembershipStats();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Membership Management</h1>
        <Button onClick={generateNewMember} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMembers}</div>
            <p className="text-xs text-green-600">96% active rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Hash className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-orange-600">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fee</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageFee}</div>
            <p className="text-xs text-green-600">Min: R10</p>
          </CardContent>
        </Card>
      </div>

      {/* Membership Number Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Number Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Province</label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(PROVINCE_CODES).map((province) => (
                    <SelectItem key={province} value={province}>
                      {province} ({PROVINCE_CODES[province as keyof typeof PROVINCE_CODES]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Sample Format</label>
              <div className="p-2 bg-gray-100 rounded text-sm font-mono">
                {generateMembershipNumber(selectedProvince, 1234567).formatted}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Fee Tiers */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Fee Tiers (Minimum R10)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeTiers.map((tier, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{tier.label}</h3>
                  <Badge variant="outline">{formatCurrency(tier.amount)}</Badge>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i}>• {benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipManagement;