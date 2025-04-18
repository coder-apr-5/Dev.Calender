"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Search, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

type Event = {
  id: string
  title: string
  date: Date
  time: string
  priority: "casual" | "important" | "urgent"
  taggedPersons: string[]
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "past">("all")
  const { user } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  // Load events from localStorage
  useEffect(() => {
    const storedEvents = localStorage.getItem("calendarEvents")
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date),
      }))
      setEvents(parsedEvents)
    }
  }, [])

  // Filter events based on search term and filter
  useEffect(() => {
    let filtered = [...events]

    // Apply filter
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (filter === "today") {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate.getTime() === today.getTime()
      })
    } else if (filter === "upcoming") {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate.getTime() > today.getTime()
      })
    } else if (filter === "past") {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate.getTime() < today.getTime()
      })
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter((event) => event.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Sort by date
    filtered.sort((a, b) => a.date.getTime() - b.date.getTime())

    setFilteredEvents(filtered)
  }, [events, searchTerm, filter])

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter((event) => event.id !== id)
    setEvents(updatedEvents)
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents))
  }

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "casual":
        return "border-l-green-500 bg-green-50 dark:bg-green-900/20"
      case "important":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
      case "urgent":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20"
      default:
        return "border-l-green-500 bg-green-50 dark:bg-green-900/20"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">View and manage all your scheduled events</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs
              defaultValue="all"
              value={filter}
              onValueChange={(value) => setFilter(value as any)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-64">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No events found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm
                  ? "Try adjusting your search or filter criteria"
                  : "Add events from the calendar to see them here"}
              </p>
              <Button variant="outline" className="mt-4" onClick={() => router.push("/calendar")}>
                Go to Calendar
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className={`p-4 border-l-4 ${getPriorityClass(event.priority)}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {event.time}
                          </div>
                        </div>
                        {event.taggedPersons.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {event.taggedPersons.map((person, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
                              >
                                @{person}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteEvent(event.id)} className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
