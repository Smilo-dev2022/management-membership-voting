import React, { useState, useEffect } from 'react';
import { iecApiService, ElectoralEventType } from '@/services/iecApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

export default function ElectoralEventList() {
  const [eventTypes, setEventTypes] = useState<ElectoralEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        setLoading(true);
        const data = await iecApiService.getElectoralEventTypes();
        setEventTypes(data);
      } catch (err) {
        setError('Failed to fetch electoral event types.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading event types...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventTypes.map((eventType) => (
            <TableRow key={eventType.ID}>
              <TableCell>{eventType.ID}</TableCell>
              <TableCell>{eventType.Description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
