import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Users, Calendar, QrCode, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  rsvps: { userId: string; response: 'yes' | 'no' | 'maybe'; userName: string }[];
  qrCode?: string;
}

const CommunicationTools: React.FC = () => {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('all');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Branch Meeting',
      description: 'Monthly branch meeting to discuss upcoming initiatives',
      date: '2024-02-15T14:00',
      location: 'Community Hall',
      rsvps: [
        { userId: '1', response: 'yes', userName: 'John Doe' },
        { userId: '2', response: 'maybe', userName: 'Jane Smith' },
        { userId: '3', response: 'no', userName: 'Bob Wilson' }
      ]
    }
  ]);
  const { toast } = useToast();

  const sendBroadcastMessage = () => {
    if (!message.trim()) {
      toast({ title: "Error", description: "Please enter a message", variant: "destructive" });
      return;
    }

    // Mock sending message
    toast({
      title: "Message Sent",
      description: `Broadcast message sent to ${recipient === 'all' ? 'all members' : recipient}`,
    });
    setMessage('');
  };

  const createEvent = () => {
    if (!eventTitle.trim() || !eventDate) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventTitle,
      description: eventDescription,
      date: eventDate,
      location: eventLocation,
      rsvps: [],
      qrCode: `QR-${Date.now()}`
    };

    setEvents([...events, newEvent]);
    toast({ title: "Success", description: "Event created successfully" });
    
    // Reset form
    setEventTitle('');
    setEventDescription('');
    setEventDate('');
    setEventLocation('');
  };
  const getRSVPStats = (event: Event) => {
    const yes = event.rsvps.filter(r => r.response === 'yes').length;
    const no = event.rsvps.filter(r => r.response === 'no').length;
    const maybe = event.rsvps.filter(r => r.response === 'maybe').length;
    return { yes, no, maybe };
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Communication Tools</h1>

      {/* Broadcast Messaging */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Broadcast Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={recipient} onValueChange={setRecipient}>
            <SelectTrigger>
              <SelectValue placeholder="Select recipients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="coordinators">Coordinators Only</SelectItem>
              <SelectItem value="vds">VD Leaders</SelectItem>
              <SelectItem value="branch">Branch Members</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your broadcast message..."
            rows={4}
          />
          <Button onClick={sendBroadcastMessage} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Send Broadcast
          </Button>
        </CardContent>
      </Card>

      {/* Event Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Create Event
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Event title"
            />
            <Input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
          <Input
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            placeholder="Event location"
          />
          <Textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Event description"
            rows={3}
          />
          <Button onClick={createEvent} className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => {
              const stats = getRSVPStats(event);
              return (
                <div key={event.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <QrCode className="h-3 w-3" />
                      QR Check-in
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>📅 {new Date(event.date).toLocaleString()}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{stats.yes} Yes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">{stats.maybe} Maybe</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">{stats.no} No</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationTools;