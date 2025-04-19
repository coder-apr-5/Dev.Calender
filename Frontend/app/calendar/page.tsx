"use client"

import { useState, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, PerspectiveCamera } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Plus, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/components/notification-provider"

type Event = {
  id: string
  title: string
  date: Date
  time: string
  priority: "casual" | "important" | "urgent"
  taggedPersons: string[]
}

type CalendarMode = "work" | "personal" | "combined"

// Loading component for the 3D calendar
function CalendarLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading calendar...</p>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState<{
    title: string
    date: Date | undefined
    time: string
    priority: "casual" | "important" | "urgent"
    taggedPersons: string
  }>({
    title: "",
    date: new Date(),
    time: "",
    priority: "casual",
    taggedPersons: "",
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("combined")
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [theme, setTheme] = useState("purple")
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const { requestPermission, hasPermission, scheduleNotification } = useNotifications()

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  // Request notification permission when the page loads
  useEffect(() => {
    if (!hasPermission) {
      requestPermission()
    }
  }, [hasPermission, requestPermission])

  // Load events from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEvents = localStorage.getItem("calendarEvents")
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
            ...event,
            date: new Date(event.date),
          }))
          setEvents(parsedEvents)
        } catch (error) {
          console.error("Failed to parse stored events:", error)
          // Reset to empty array if parsing fails
          setEvents([])
        }
      }
    }
  }, [])

  // Save events to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && events.length > 0) {
      localStorage.setItem("calendarEvents", JSON.stringify(events))
    }
  }, [events])

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const taggedPersonsArray = newEvent.taggedPersons
      ? newEvent.taggedPersons.split(",").map((person) => person.trim())
      : []

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      priority: newEvent.priority,
      taggedPersons: taggedPersonsArray,
    }

    setEvents([...events, event])
    setNewEvent({
      title: "",
      date: new Date(),
      time: "",
      priority: "casual",
      taggedPersons: "",
    })
    setShowAddEvent(false)

    toast({
      title: "Event Added",
      description: `"${event.title}" has been added to your calendar.`,
    })

    // Schedule notification for this event
    scheduleEventNotification(event)
  }

  const scheduleEventNotification = (event: Event) => {
    if (hasPermission) {
      const eventTime = new Date(event.date)
      const [hours, minutes] = event.time.split(":").map(Number)
      eventTime.setHours(hours, minutes, 0, 0)

      const now = new Date()
      const timeDiff = eventTime.getTime() - now.getTime()

      if (timeDiff > 0) {
        // Schedule notification for event time
        scheduleNotification(`Event: ${event.title}`, `It's time for your scheduled event!`, timeDiff)

        // Also schedule a reminder 5 minutes before if the event is more than 5 minutes away
        if (timeDiff > 5 * 60 * 1000) {
          scheduleNotification(`Reminder: ${event.title}`, `Your event starts in 5 minutes`, timeDiff - 5 * 60 * 1000)
        }
      }
    }
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
    toast({
      title: "Event Deleted",
      description: "The event has been removed from your calendar.",
    })
  }

  const getEventsByDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  // Create calendar days array
  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null) // Empty cells for days before the 1st of the month
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentYear, currentMonth, i))
  }

  // Don't render anything on the server
  if (!isClient) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-muted-foreground">Manage your schedule and events efficiently</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Tabs
              defaultValue="combined"
              value={calendarMode}
              onValueChange={(value) => setCalendarMode(value as CalendarMode)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="work">Work</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="combined">Combined</TabsTrigger>
              </TabsList>
            </Tabs>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowAddEvent(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 lg:col-span-2 h-[600px] overflow-hidden">
            <CardContent className="p-0 h-full">
              <div className="h-full w-full bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
                <Suspense fallback={<CalendarLoading />}>
                  <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 5, 10]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <CalendarGrid
                      days={calendarDays}
                      events={events}
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                      setShowAddEvent={setShowAddEvent}
                      theme={theme}
                    />
                    <OrbitControls
                      enableZoom={true}
                      minPolarAngle={Math.PI / 4}
                      maxPolarAngle={Math.PI / 2.2}
                      minDistance={8}
                      maxDistance={15}
                    />
                  </Canvas>
                </Suspense>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 h-[600px] overflow-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Events"}</h2>
              </div>

              {selectedDate && getEventsByDate(selectedDate).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No events scheduled for this day</p>
                  <Button variant="outline" className="mt-4" onClick={() => setShowAddEvent(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDate &&
                    getEventsByDate(selectedDate).map((event) => (
                      <div
                        key={event.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          event.priority === "casual"
                            ? "border-l-green-500 bg-green-50 dark:bg-green-900/20"
                            : event.priority === "important"
                              ? "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                              : "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.time}</p>
                            {event.taggedPersons.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
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
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {showAddEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Add New Event</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowAddEvent(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter event title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newEvent.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newEvent.date ? format(newEvent.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newEvent.date}
                          onSelect={(date) => setNewEvent({ ...newEvent, date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newEvent.priority}
                      onValueChange={(value: any) => setNewEvent({ ...newEvent, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual (Green)</SelectItem>
                        <SelectItem value="important">Important (Yellow)</SelectItem>
                        <SelectItem value="urgent">Urgent (Red)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagged-persons">Tagged Persons</Label>
                    <Input
                      id="tagged-persons"
                      placeholder="Enter names separated by commas"
                      value={newEvent.taggedPersons}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          taggedPersons: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button className="w-full" onClick={addEvent}>
                    Add Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function CalendarGrid({
  days,
  events,
  selectedDate,
  setSelectedDate,
  setShowAddEvent,
  theme,
}: {
  days: (Date | null)[]
  events: Event[]
  selectedDate: Date | undefined
  setSelectedDate: (date: Date) => void
  setShowAddEvent: (show: boolean) => void
  theme: string
}) {
  const getThemeColor = () => {
    switch (theme) {
      case "purple":
        return [0.5, 0.2, 0.8] // Purple
      case "blue":
        return [0.2, 0.4, 0.8] // Blue
      case "green":
        return [0.2, 0.8, 0.4] // Green
      case "orange":
        return [0.9, 0.5, 0.2] // Orange
      default:
        return [0.5, 0.2, 0.8] // Default purple
    }
  }

  const themeColor = getThemeColor()

  const getEventsByDate = (date: Date | null) => {
    if (!date) return []
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  const getEventColor = (priority: string) => {
    switch (priority) {
      case "casual":
        return [0.2, 0.8, 0.2] // Green
      case "important":
        return [0.9, 0.9, 0.2] // Yellow
      case "urgent":
        return [0.8, 0.2, 0.2] // Red
      default:
        return [0.2, 0.8, 0.2] // Default green
    }
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Month header */}
      <Text position={[0, 2, 0]} color="white" fontSize={0.5} font="/fonts/Inter_Bold.json">
        {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
      </Text>

      {/* Day headers */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
        <Text
          key={day}
          position={[(i - 3) * 1.2, 1.2, 0]}
          color="white"
          fontSize={0.3}
          font="/fonts/Inter_Regular.json"
        >
          {day}
        </Text>
      ))}

      {/* Calendar grid */}
      {days.map((date, index) => {
        const row = Math.floor(index / 7)
        const col = index % 7
        const x = (col - 3) * 1.2
        const y = -row * 1.2
        const dateEvents = getEventsByDate(date)

        return date ? (
          <group key={index} position={[x, y, 0]}>
            {/* Day cell */}
            <mesh
              position={[0, 0, -0.1]}
              onClick={() => setSelectedDate(date)}
              onDoubleClick={() => {
                setSelectedDate(date)
                setShowAddEvent(true)
              }}
            >
              <boxGeometry args={[1, 0.8, 0.1]} />
              <meshStandardMaterial
                color={
                  isSelected(date)
                    ? `rgb(${themeColor[0] * 255}, ${themeColor[1] * 255}, ${themeColor[2] * 255})`
                    : isToday(date)
                      ? "#4a5568"
                      : "#1a202c"
                }
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* Day number */}
            <Text
              position={[-0.35, 0.15, 0]}
              color="white"
              fontSize={0.25}
              font="/fonts/Inter_Regular.json"
              anchorX="left"
            >
              {date.getDate()}
            </Text>

            {/* Event indicators */}
            {dateEvents.slice(0, 3).map((event, i) => {
              const eventColor = getEventColor(event.priority)
              return (
                <mesh key={i} position={[0, -0.1 - i * 0.15, 0]}>
                  <boxGeometry args={[0.8, 0.1, 0.05]} />
                  <meshStandardMaterial
                    color={`rgb(${eventColor[0] * 255}, ${eventColor[1] * 255}, ${eventColor[2] * 255})`}
                  />
                </mesh>
              )
            })}

            {/* More events indicator */}
            {dateEvents.length > 3 && (
              <Text position={[0.3, -0.25, 0]} color="white" fontSize={0.15} font="/fonts/Inter_Regular.json">
                +{dateEvents.length - 3}
              </Text>
            )}
          </group>
        ) : (
          <group key={index} position={[x, y, 0]} />
        )
      })}
    </group>
  )
}
