import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, User, MessageSquare, UserPlus, Vote, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ActivityLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  level: string;
  entityId?: string;
}

interface ActivityLogProps {
  userRole: string;
  limit?: number;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ userRole, limit = 50 }) => {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [userRole]);

  const fetchActivities = async () => {
    try {
      // Mock data for now - replace with real Supabase query
      const mockActivities: ActivityLogEntry[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          action: 'member_registered',
          details: 'Registered new member: Jane Smith',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          level: 'branch'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Mary Johnson',
          action: 'message_sent',
          details: 'Sent broadcast message to all VDs',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          level: 'branch'
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'David Wilson',
          action: 'payment_processed',
          details: 'Processed membership fee: R50.00',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          level: 'branch'
        },
        {
          id: '4',
          userId: 'user1',
          userName: 'John Doe',
          action: 'vote_created',
          details: 'Created new vote: Branch Leadership Election',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          level: 'branch'
        }
      ];
      
      setActivities(mockActivities.slice(0, limit));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'member_registered':
        return <UserPlus className="h-4 w-4" />;
      case 'message_sent':
        return <MessageSquare className="h-4 w-4" />;
      case 'payment_processed':
        return <DollarSign className="h-4 w-4" />;
      case 'vote_created':
        return <Vote className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'member_registered':
        return 'bg-green-100 text-green-800';
      case 'message_sent':
        return 'bg-blue-100 text-blue-800';
      case 'payment_processed':
        return 'bg-yellow-100 text-yellow-800';
      case 'vote_created':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {activity.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className={getActionColor(activity.action)}>
                      {getActionIcon(activity.action)}
                      <span className="ml-1 capitalize">{activity.action.replace('_', ' ')}</span>
                    </Badge>
                    <span className="text-sm text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{activity.userName}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;