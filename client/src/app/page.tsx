"use client"

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"
import { Bell, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

// For fixing marker icon not showing
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

type DisasterEvent = {
  id: number
  type: string
  location: string
  severity: 'Low' | 'Medium' | 'High'
  coordinates: [number, number]
  affectedPopulation: number
  lastUpdate: string
}

const disasterEvents: DisasterEvent[] = [
  { id: 1, type: 'Earthquake', location: 'San Francisco, USA', severity: 'High', coordinates: [37.7749, -122.4194], affectedPopulation: 870000, lastUpdate: '2 hours ago' },
  { id: 2, type: 'Flood', location: 'Bangkok, Thailand', severity: 'Medium', coordinates: [13.7563, 100.5018], affectedPopulation: 350000, lastUpdate: '5 hours ago' },
  { id: 3, type: 'Fire', location: 'Sydney, Australia', severity: 'Low', coordinates: [-33.8688, 151.2093], affectedPopulation: 15000, lastUpdate: '1 day ago' },
  { id: 4, type: 'Hurricane', location: 'Miami, USA', severity: 'High', coordinates: [25.7617, -80.1918], affectedPopulation: 450000, lastUpdate: '3 hours ago' },
  { id: 5, type: 'Tsunami', location: 'Tokyo, Japan', severity: 'High', coordinates: [35.6762, 139.6503], affectedPopulation: 1200000, lastUpdate: '1 hour ago' },
  { id: 5, type: 'Tsunami', location: 'Tokyo, Japan', severity: 'High', coordinates: [28.457949, 77.507159], affectedPopulation: 1200000, lastUpdate: '1 hour ago' },
]

export default function EnhancedDisasterDashboard() {
  const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null)
  const [searchTerm, setSearchTerm] = useState('');
  const { push } = useRouter();

  const filteredEvents = disasterEvents.filter(event =>
    event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  const getTotalAffectedPopulation = () => {
    return disasterEvents.reduce((total, event) => total + event.affectedPopulation, 0).toLocaleString()
  }

  const getActiveDisasters = () => {
    return disasterEvents.length
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Navbar */}
      <Navbar />


      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Disasters</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getActiveDisasters()}</div>
                <p className="text-xs text-muted-foreground">Across various locations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Affected Population</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalAffectedPopulation()}</div>
                <p className="text-xs text-muted-foreground">People impacted by disasters</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Teams</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">50+</div>
                <p className="text-xs text-muted-foreground">Teams deployed worldwide</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Disaster Events</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="h-[calc(100vh-400px)] overflow-y-auto">
                  <ul className="space-y-4">
                    {filteredEvents.map((event) => (
                      <li
                        key={event.id}
                        className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{event.type}</h3>
                            <p className="text-sm text-gray-600">{event.location}</p>
                          </div>
                          <Badge variant="outline" className={`${getSeverityColor(event.severity)} text-white`}>
                            {event.severity}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Affected: {event.affectedPopulation.toLocaleString()}</p>
                          <p>Updated: {event.lastUpdate}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="w-full lg:w-2/3">
              <Card className="h-[calc(100vh-200px)]">
                <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {disasterEvents.map((event) => (
                    <Marker key={event.id} position={event.coordinates}>
                      <Popup>
                        <h3 className="font-semibold">{event.type}</h3>
                        <p>{event.location}</p>
                        <p>Severity: {event.severity}</p>
                        <p>Affected: {event.affectedPopulation.toLocaleString()}</p>
                        <p>Last Update: {event.lastUpdate}</p>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {
        selectedEvent && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-[9999]">
            <h3 className="font-semibold text-lg">{selectedEvent.type}</h3>
            <p className="text-gray-600">{selectedEvent.location}</p>
            <Badge variant="outline" className={`${getSeverityColor(selectedEvent.severity)} text-white mt-2`}>
              {selectedEvent.severity} Severity
            </Badge>
            <p className="mt-2">Affected Population: {selectedEvent.affectedPopulation.toLocaleString()}</p>
            <p>Last Updated: {selectedEvent.lastUpdate}</p>
            <Button className="mt-4 w-full" onClick={() => push("/details/" + selectedEvent.id)}>View Detailed Report</Button>
          </div>
        )
      }
    </div >
  )
}