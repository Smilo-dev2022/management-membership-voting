import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, User, MessageSquare, UserPlus, Vote, DollarSign, Shield } from 'lucide-react';
import { useAuditLog } from '@/hooks/useAuditLog';

interface ActivityLogProps {
  limit?: number;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ limit = 10 }) => {
  const { logs, loading, fetchLogs } = useAuditLog();

  useEffect(() => {
    // Fetch all logs and the component will slice the array
    fetchLogs();
  }, [fetchLogs]);

  const activities = logs.slice(0, limit);

  const getActionIcon = (action: string) => {
    if (action.includes('member')) return <UserPlus className="h-4 w-4" />;
    if (action.includes('vote')) return <Vote className="h-4 w-4" />;
    if (action.includes('message')) return <MessageSquare className="h-4 w-4" />;
    if (action.includes('payment')) return <DollarSign className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('create') || action.includes('register')) return 'bg-green-100 text-green-800';
    if (action.includes('update')) return 'bg-blue-100 text-blue-800';
    if (action.includes('delete')) return 'bg-red-100 text-red-800';
    if (action.includes('sent')) return 'bg-cyan-100 text-cyan-800';
    if (action.includes('vote')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
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
                    {activity.user_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className={getActionColor(activity.action)}>
                      {getActionIcon(activity.action)}
                      <span className="ml-1 capitalize">{activity.action.replace(/_/g, ' ')}</span>
                    </Badge>
                    <span className="text-sm text-gray-500">{formatTimestamp(activity.created_at)}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{activity.user_name}</p>
                  <p className="text-sm text-gray-600 truncate">
                    {Object.entries(activity.details || {}).map(([key, value]) => `${key}: ${value}`).join(', ')}
                  </p>
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