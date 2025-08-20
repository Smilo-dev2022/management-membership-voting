import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ArrowLeft, MapPin, Users, MessageSquare, BarChart3 } from 'lucide-react';

interface Office {
  id: string;
  name: string;
  type: 'national' | 'province' | 'region' | 'branch' | 'vd';
  parent_id?: string;
  stats?: {
    members?: number;
    events?: number;
    messages?: number;
  };
}

interface OfficeNavigationProps {
  onNavigate: (page: string) => void;
}

const OfficeNavigation: React.FC<OfficeNavigationProps> = ({ onNavigate }) => {
  const [currentLevel, setCurrentLevel] = useState<'national' | 'province' | 'region' | 'branch' | 'vd'>('national');
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<Office[]>([]);

  // Mock data matching the diagram
  const offices: Record<string, Office[]> = {
    national: [
      { id: 'nat1', name: 'National Office', type: 'national', stats: { members: 50000, events: 12, messages: 150 } }
    ],
    province: [
      { id: 'prov1', name: 'Western Cape', type: 'province', parent_id: 'nat1', stats: { members: 12000, events: 8, messages: 45 } },
      { id: 'prov2', name: 'Gauteng', type: 'province', parent_id: 'nat1', stats: { members: 18000, events: 15, messages: 78 } },
      { id: 'prov3', name: 'KwaZulu-Natal', type: 'province', parent_id: 'nat1', stats: { members: 15000, events: 10, messages: 62 } }
    ],
    region: [
      { id: 'reg1', name: 'Cape Town Metro', type: 'region', parent_id: 'prov1', stats: { members: 8000, events: 5, messages: 28 } },
      { id: 'reg2', name: 'West Coast', type: 'region', parent_id: 'prov1', stats: { members: 2000, events: 2, messages: 12 } }
    ],
    branch: [
      { id: 'br1', name: 'Mitchells Plain Branch', type: 'branch', parent_id: 'reg1', stats: { members: 1200, events: 3, messages: 15 } },
      { id: 'br2', name: 'Khayelitsha Branch', type: 'branch', parent_id: 'reg1', stats: { members: 1800, events: 4, messages: 22 } }
    ],
    vd: [
      { id: 'vd1', name: 'VD 001 - Eastridge', type: 'vd', parent_id: 'br1', stats: { members: 250, events: 1, messages: 8 } },
      { id: 'vd2', name: 'VD 002 - Westridge', type: 'vd', parent_id: 'br1', stats: { members: 180, events: 2, messages: 5 } }
    ]
  };

  const levelActions = {
    national: ['View National Reports', 'Send Broadcast', 'Manage Provinces'],
    province: ['View Province Stats', 'Manage Regions', 'Send Notices'],
    region: ['View Region Stats', 'Organise Events', 'Mobilise Volunteers'],
    branch: ['Manage Members', 'Approve Local Votes', 'Share Documents'],
    vd: ['Canvassing', 'Attendance Tracking', 'Local Chat']
  };

  const navigateToLevel = (office: Office) => {
    const nextLevel = getNextLevel(office.type);
    if (nextLevel) {
      setBreadcrumb([...breadcrumb, office]);
      setSelectedOffice(office);
      setCurrentLevel(nextLevel);
    }
  };

  const goBack = () => {
    if (breadcrumb.length > 0) {
      const newBreadcrumb = [...breadcrumb];
      newBreadcrumb.pop();
      setBreadcrumb(newBreadcrumb);
      
      if (newBreadcrumb.length > 0) {
        const prevOffice = newBreadcrumb[newBreadcrumb.length - 1];
        setSelectedOffice(prevOffice);
        setCurrentLevel(getNextLevel(prevOffice.type) || 'national');
      } else {
        setSelectedOffice(null);
        setCurrentLevel('national');
      }
    }
  };

  const getNextLevel = (type: string): 'province' | 'region' | 'branch' | 'vd' | null => {
    const levels = { national: 'province', province: 'region', region: 'branch', branch: 'vd' };
    return levels[type as keyof typeof levels] as any || null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            {breadcrumb.map((office, index) => (
              <React.Fragment key={office.id}>
                <span>{office.name}</span>
                {index < breadcrumb.length - 1 && <ChevronRight className="h-4 w-4" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Current Level Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold capitalize">{currentLevel} Level</h2>
        <Badge variant="outline" className="capitalize">{currentLevel}</Badge>
      </div>

      {/* Office Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offices[currentLevel]?.map((office) => (
          <Card key={office.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{office.name}</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Members
                  </div>
                  <span className="font-semibold">{office.stats?.members || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Events
                  </div>
                  <span className="font-semibold">{office.stats?.events || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Messages
                  </div>
                  <span className="font-semibold">{office.stats?.messages || 0}</span>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={() => navigateToLevel(office)}
                disabled={!getNextLevel(office.type)}
              >
                {getNextLevel(office.type) ? `View ${getNextLevel(office.type)}s` : 'Manage'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions for Current Level */}
      <Card>
        <CardHeader>
          <CardTitle>Available Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {levelActions[currentLevel]?.map((action, index) => (
              <Button key={index} variant="outline" className="justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                {action}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficeNavigation;