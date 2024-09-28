"use client"

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from 'lucide-react';
import { useRouter } from "next/navigation";
import Navbar from '@/components/Navbar';
import { useQuery } from '@tanstack/react-query'
import { backendUrl } from '@/lib/utils'
import axios from 'axios'


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
    description: string
    timeline?: { date: string; event: string }[]
    resources?: { type: string; allocated: number; required: number }[]
}

const disasterEventData: DisasterEvent = {
    id: 1,
    type: 'Earthquake',
    location: 'San Francisco, USA',
    severity: 'High',
    coordinates: [37.7749, -122.4194],
    affectedPopulation: 870000,
    lastUpdate: '2 hours ago',
    description: 'A magnitude 7.1 earthquake struck San Francisco, causing widespread damage to infrastructure and displacing thousands of residents. Aftershocks continue to pose risks.',
    timeline: [
        { date: '2023-09-15 14:30', event: 'Initial earthquake (Magnitude 7.1)' },
        { date: '2023-09-15 14:45', event: 'Tsunami warning issued' },
        { date: '2023-09-15 15:00', event: 'Emergency services deployed' },
        { date: '2023-09-15 16:30', event: 'Aftershock (Magnitude 5.4)' },
        { date: '2023-09-15 18:00', event: 'Evacuation centers established' },
        { date: '2023-09-16 08:00', event: 'Initial damage assessment completed' },
    ],
    resources: [
        { type: 'Emergency Responders', allocated: 500, required: 750 },
        { type: 'Temporary Shelters', allocated: 50, required: 100 },
        { type: 'Medical Supplies (tons)', allocated: 25, required: 40 },
        { type: 'Food and Water (tons)', allocated: 100, required: 150 },
    ],
}

export default function Page() {
    const [activeTab, setActiveTab] = useState('overview');

    const { push } = useRouter()

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

    // const { isPending, refetch, data: disasterEventData } = useQuery<DisasterEvent>({
    //     queryKey: ['events'],
    //     queryFn: async () => {
    //         const response = await axios.get(`${backendUrl}/api/event/get/:id`);
    //         return response.data;
    //     }
    // });

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">


            <Navbar />

            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <Button variant="outline" onClick={() => push('/')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl">{disasterEventData?.type}</CardTitle>
                                        <p className="text-gray-500">{disasterEventData?.location}</p>
                                    </div>
                                    <Badge variant="outline" className={`${getSeverityColor(disasterEventData?.severity ?? "Medium")} text-white`}>
                                        {disasterEventData?.severity} Severity
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="overview">Overview</TabsTrigger>
                                        <TabsTrigger value="timeline">Timeline</TabsTrigger>
                                        <TabsTrigger value="resources">Resources</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="overview">
                                        <div className="space-y-4">
                                            <p>{disasterEventData?.description}</p>
                                            <div>
                                                <h3 className="font-semibold">Affected Population</h3>
                                                <p>{disasterEventData?.affectedPopulation.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Last Updated</h3>
                                                <p>{disasterEventData?.lastUpdate}</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="timeline">
                                        <ul className="space-y-4">
                                            {disasterEventData?.timeline?.map((item, index) => (
                                                <li key={index} className="flex items-start">
                                                    <div className="flex-shrink-0 w-12 text-sm text-gray-500">{item.date.split(' ')[1]}</div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium">{item.event}</div>
                                                        <div className="text-sm text-gray-500">{item.date.split(' ')[0]}</div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </TabsContent>
                                    <TabsContent value="resources">
                                        <ul className="space-y-4">
                                            {disasterEventData?.resources?.map((resource, index) => (
                                                <li key={index}>
                                                    <div className="flex justify-between mb-1">
                                                        <span>{resource.type}</span>
                                                        <span>{resource.allocated} / {resource.required}</span>
                                                    </div>
                                                    <Progress value={(resource.allocated / resource.required) * 100} />
                                                </li>
                                            ))}
                                        </ul>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Location</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <MapContainer center={disasterEventData?.coordinates} zoom={10} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={disasterEventData?.coordinates ?? [-33.8688, 151.2093]}>
                                        <Popup>
                                            <h3 className="font-semibold">{disasterEventData?.type}</h3>
                                            <p>{disasterEventData?.location}</p>
                                            <p>Severity: {disasterEventData?.severity}</p>
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}