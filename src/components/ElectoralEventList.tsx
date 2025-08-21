import React, { useState, useEffect } from 'react';
import { iecApiService, ElectoralEventType, ElectoralEvent } from '@/services/iecApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ChevronRight, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ElectoralEventList() {
  const [eventTypes, setEventTypes] = useState<ElectoralEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEventTypeId, setExpandedEventTypeId] = useState<number | null>(null);
  const [events, setEvents] = useState<ElectoralEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

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

  const handleEventTypeClick = async (eventTypeId: number) => {
    if (expandedEventTypeId === eventTypeId) {
      setExpandedEventTypeId(null);
      setEvents([]);
      return;
    }

    setExpandedEventTypeId(eventTypeId);
    setLoadingEvents(true);
    try {
      const data = await iecApiService.getElectoralEvents(eventTypeId);
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch electoral events:', err);
      // You might want to set a specific error for this
    } finally {
      setLoadingEvents(false);
    }
  };

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
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventTypes.map((eventType) => (
            <React.Fragment key={eventType.ID}>
              <TableRow onClick={() => handleEventTypeClick(eventType.ID)} className="cursor-pointer">
                <TableCell>
                  {expandedEventTypeId === eventType.ID ? <ChevronDown /> : <ChevronRight />}
                </TableCell>
                <TableCell>{eventType.ID}</TableCell>
                <TableCell>{eventType.Description}</TableCell>
              </TableRow>
              {expandedEventTypeId === eventType.ID && (
                <TableRow>
                  <TableCell colSpan={3}>
                    {loadingEvents ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2 text-sm">Loading events...</span>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-md">
                        <h4 className="font-semibold mb-2">Specific Events:</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Event ID</TableHead>
                              <TableHead>Event Description</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {events.map(event => (
                              <TableRow key={event.ID}>
                                <TableCell>{event.ID}</TableCell>
                                <TableCell>{event.Description}</TableCell>
                                <TableCell>
                                  <Badge variant={event.IsActive ? 'default' : 'secondary'}>
                                    {event.IsActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
