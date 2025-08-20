import React, { useEffect } from 'react';
import { useAuditLog } from '@/hooks/useAuditLog';
import { Loader2, User, MessageSquare, UserPlus, Vote, DollarSign } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AuditTrailProps {
  targetId: string;
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'member_registered': return <UserPlus className="h-4 w-4" />;
    case 'message_sent': return <MessageSquare className="h-4 w-4" />;
    case 'payment_processed': return <DollarSign className="h-4 w-4" />;
    case 'vote_created': return <Vote className="h-4 w-4" />;
    case 'vote_cast': return <Vote className="h-4 w-4 text-green-600" />;
    default: return <User className="h-4 w-4" />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'member_registered': return 'bg-green-100 text-green-800';
    case 'message_sent': return 'bg-blue-100 text-blue-800';
    case 'payment_processed': return 'bg-yellow-100 text-yellow-800';
    case 'vote_created': return 'bg-purple-100 text-purple-800';
    case 'vote_cast': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const AuditTrail: React.FC<AuditTrailProps> = ({ targetId }) => {
  const { logs, loading, fetchLogs, error } = useAuditLog();

  useEffect(() => {
    if (targetId) {
      fetchLogs(targetId);
    }
  }, [targetId, fetchLogs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading audit trail...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (logs.length === 0) {
    return <p className="text-gray-500 text-center py-4">No activities found for this item.</p>;
  }

  return (
    <ScrollArea className="h-96">
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {log.user_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className={getActionColor(log.action)}>
                  {getActionIcon(log.action)}
                  <span className="ml-1 capitalize">{log.action.replace('_', ' ')}</span>
                </Badge>
                <span className="text-sm text-gray-500">{formatTimestamp(log.created_at)}</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{log.user_name}</p>
              {log.details?.option_id && <p className="text-sm text-gray-600">Voted for option: {log.details.option_id}</p>}
              {log.details?.title && <p className="text-sm text-gray-600">Vote Created: {log.details.title}</p>}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
