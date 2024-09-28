"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import {backendUrl} from '@/lib/utils';
import {
  useQuery,
} from '@tanstack/react-query'


type DisasterEvent = {
  _id: string
  type: string
  location: string
  affectedPopulation?: number | string
  coordinates: [number, number] | string
  severity: 'Low' | 'Medium' | 'High'
  description: string
}

export default function DisasterManagement() {
  
  const [editingEvent, setEditingEvent] = useState<DisasterEvent | null>(null)
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false)
  const [isSOSDialogOpen, setIsSOSDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<DisasterEvent>>({})
  const [sosMessage, setSOSMessage] = useState({ eventName: '', location: '', message: '' });

  const { push } = useRouter();
  const { data: session, status } = useSession() as { data: { user: { role: string } } | null, status: string };

  const handleEditEvent = () => {
    if (editingEvent) {

      console.log(editingEvent);
      
      
      axios.put(`${backendUrl}/api/event/update/${editingEvent._id}`, editingEvent)
        .then(response => {
          refetch();
        })
        .catch(error => {
          // alert(error);
          console.error(error);
        });
      setEditingEvent(null)
    }
  }

  const handleSendSOS = () => {
    // In a real application, you would send this message to a server or other users
    console.log('SOS Message sent:', sosMessage)
    setSOSMessage({ eventName: '', location: '', message: '' })
    setIsSOSDialogOpen(false)
  }

  const getSeverityColor = (severity: DisasterEvent['severity']) => {
    switch (severity) {
      case 'Low':
        return 'bg-yellow-500'
      case 'Medium':
        return 'bg-orange-500'
      case 'High':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const {isPending, refetch, data: eventData} = useQuery<DisasterEvent[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}/api/event/all`);
      return response.data;
    }
  });

  const handleAddEvent = async () => {
    if (newEvent.type && newEvent.location && newEvent.severity) {
      
      axios.post(`${backendUrl}/api/event/create`, newEvent)
        .then(response => {
          refetch();

          setNewEvent({})
          setIsAddEventDialogOpen(false)
        })
        .catch(error => {
          console.error(error);
          // alert('Failed to add event');
        });
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
      push('/');
    }
  }, [status, push, session?.user?.role]);

  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start md:items-center mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Disaster Events</h2>
            <div className="space-x-4 flex md:flex-row flex-col md:space-y-0 space-y-2">
              <Button onClick={() => setIsAddEventDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Event
              </Button>
              <Button variant="destructive" onClick={() => setIsSOSDialogOpen(true)}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Send SOS
              </Button>
            </div>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Coordinates</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventData?.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell>{event.type}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{Array.isArray(event.coordinates) ? event.coordinates.join(', ') : event.coordinates}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getSeverityColor(event.severity)} text-white`}>
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>
                        <Button variant="ghost" onClick={() => setEditingEvent(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Disaster Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Input
                id="type"
                value={newEvent.type || ''}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={newEvent.location || ''}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coordinates" className="text-right">
                Coordinates
              </Label>
              <Input
                id="coordinates"
                value={newEvent.coordinates?.toString() || ''}
                placeholder='lat, long (separated by comma)'
                onChange={(e) => setNewEvent({ ...newEvent, coordinates: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coordinates" className="text-right">
                Affected Population
              </Label>
              <Input
                id="affectedPopulation"
                value={newEvent.affectedPopulation?.toString() || ''}
                onChange={(e) => setNewEvent({ ...newEvent, affectedPopulation: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="severity" className="text-right">
                Severity
              </Label>
              <Select
                onValueChange={(value: any) => setNewEvent({ ...newEvent, severity: value as DisasterEvent['severity'] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newEvent.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editingEvent !== null} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Disaster Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Input
                id="edit-type"
                value={editingEvent?.type || ''}
                onChange={(e) => setEditingEvent(editingEvent ? { ...editingEvent, type: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right">
                Location
              </Label>
              <Input
                id="edit-location"
                value={editingEvent?.location || ''}
                onChange={(e) => setEditingEvent(editingEvent ? { ...editingEvent, location: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-coordinates" className="text-right">
                Location
              </Label>
              <Input
                id="edit-coordinates"
                value={editingEvent?.coordinates?.toString() || ''}
                onChange={(e) => setEditingEvent(editingEvent ? { ...editingEvent, coordinates: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-severity" className="text-right">
                Severity
              </Label>
              <Select
                value={editingEvent?.severity}
                onValueChange={(value: any) => setEditingEvent(editingEvent ? { ...editingEvent, severity: value as DisasterEvent['severity'] } : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={editingEvent?.description || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingEvent(editingEvent ? { ...editingEvent, description: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditEvent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSOSDialogOpen} onOpenChange={setIsSOSDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send SOS Message</DialogTitle>
            <DialogDescription>
              Send an urgent message to notify others about a disaster event.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sos-event-name" className="text-right">
                Event Name
              </Label>
              <Input
                id="sos-event-name"
                value={sosMessage.eventName}
                onChange={(e) => setSOSMessage({ ...sosMessage, eventName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sos-location" className="text-right">
                Location
              </Label>
              <Input
                id="sos-location"
                value={sosMessage.location}
                onChange={(e) => setSOSMessage({ ...sosMessage, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sos-message" className="text-right">
                Message
              </Label>
              <Textarea
                id="sos-message"
                value={sosMessage.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSOSMessage({ ...sosMessage, message: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSendSOS} variant="destructive">Send SOS</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}