'use client'

import { useEffect, useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
export default function CalendarPage() {
  const [days, setDays] = useState<Date[]>([])
  const [startPadding, setStartPadding] = useState<number>(0)
  const events = [{
    name: "DummyEvent1",
    timeStart: new Date(),
    _id: 'byv7578b5deqw7tvc9eqwt'
  },{
    name: "DummyEvent2",
    timeStart: new Date().setDate(new Date().getDate() - 10),
    _id: 'binfiuye8wrfwgfb87ectg'
  }]
  useEffect(() => {
    const now = new Date()
    const start = startOfMonth(now)
    const end = endOfMonth(now)
    const allDays = eachDayOfInterval({ start, end })
    setDays(allDays)

    // Get the day index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayIndex = start.getDay()
    setStartPadding(dayIndex) // This determines how many blanks to add before the first day
  }, [])

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Developer Calendar</CardTitle>
          <CardDescription>{format(new Date(), "MMMM yyyy")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            {dayNames.map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {/* Blank cells for alignment */}
            {Array.from({ length: startPadding }).map((_, idx) => (
              <div key={`pad-${idx}`} />
            ))}

            {/* Actual days */}
            {days.map((day, index) => {
              const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
              const isEvent = events.some(event => format(event.timeStart, 'yyyy-MM-dd') === format(day, "yyyy-MM-dd"))

              return (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center rounded-md text-sm transition-all ${
                    isToday
                      ? "bg-purple-600 text-white font-bold"
                      : isEvent
                        ? "bg-green-500 text-white font-bold"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {format(day, "d")}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
