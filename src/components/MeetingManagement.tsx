import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEvents } from '@/hooks/useEvents';
import { useToast } from '@/hooks/use-toast';
import EventList from './EventList';
import EventForm from './EventForm';
import { Event } from '@/types';

const MeetingManagement: React.FC = () => {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useEvents();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);

  const handleScheduleMeeting = () => {
    setSelectedEvent(undefined);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      toast({ title: "Success", description: "Event deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete event", variant: "destructive" });
    }
  };

  const handleSaveEvent = async (eventData: Partial<Event>) => {
    try {
      if (eventData.id) {
        await updateEvent(eventData);
        toast({ title: "Success", description: "Event updated successfully" });
      } else {
        await createEvent(eventData as Omit<Event, 'id' | 'organiser_id' | 'rsvp_count'>);
        toast({ title: "Success", description: "Event created successfully" });
      }
      setIsFormOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save event", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meeting & Event Management</h2>
        <Button onClick={handleScheduleMeeting}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      <EventList
        events={events}
        loading={loading}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Schedule New Event'}</DialogTitle>
          </DialogHeader>
          <EventForm
            event={selectedEvent}
            onSave={handleSaveEvent}
            onCancel={() => setIsFormOpen(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingManagement;
