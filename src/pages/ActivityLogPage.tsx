import React, { useEffect, useState } from 'react';
import { useAuditLog } from '@/hooks/useAuditLog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const ActivityLogPage: React.FC = () => {
  const { logs, loading, fetchLogs, error } = useAuditLog();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Initial fetch for all logs
    fetchLogs();
  }, [fetchLogs]);

  // TODO: Implement search filtering on the frontend or backend
  const filteredLogs = logs.filter(log =>
    log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">System Activity Log</h1>

      <div className="mb-4">
        <Input
          placeholder="Search by user or action..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {error && <p className="text-red-500">Error fetching logs: {error}</p>}

      {!loading && !error && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                  <TableCell>{log.user_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action.replace(/_/g, ' ')}</Badge>
                  </TableCell>
                  <TableCell>{JSON.stringify(log.details)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* TODO: Add pagination controls */}
    </div>
  );
};

export default ActivityLogPage;
