"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

type NotificationContextType = {
  requestPermission: () => Promise<void>
  hasPermission: boolean
  scheduleNotification: (title: string, body: string, delay: number) => void
  sendNotification: (title: string, body: string) => void
  cancelAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType>({
  requestPermission: async () => {},
  hasPermission: false,
  scheduleNotification: () => {},
  sendNotification: () => {},
  cancelAllNotifications: () => {},
})

export const useNotifications = () => useContext(NotificationContext)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [hasPermission, setHasPermission] = useState(false)
  const { toast } = useToast()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const notificationTimers = useRef<number[]>([])
  const hasShownToastRef = useRef(false)

  useEffect(() => {
    // Create audio element for alarm sound
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/notification.mp3")
      audioRef.current.loop = false
    }

    // Check if notifications are supported and if we already have permission
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        setHasPermission(true)
      } else if (!hasShownToastRef.current) {
        toast({
          title: "Notification Disabled",
          description: "You will not receive notifications for your events",
          variant: "destructive",
        })
        hasShownToastRef.current = true
      }
    }

    return () => {
      // Clear any pending notification timers on cleanup
      notificationTimers.current.forEach(timerId => clearTimeout(timerId))
    }
  }, [])

  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        setHasPermission(true)
      }
    }
  }

  const sendNotification = (title: string, body: string) => {
    if ("Notification" in window && hasPermission) {
      new Notification(title, { body })
      if (audioRef.current) {
        audioRef.current.play().catch(() => {})
      }
    }
  }

  const scheduleNotification = (title: string, body: string, delay: number) => {
    const timerId = window.setTimeout(() => {
      sendNotification(title, body)
    }, delay)
    notificationTimers.current.push(timerId)
  }

  const cancelAllNotifications = () => {
    notificationTimers.current.forEach(timerId => clearTimeout(timerId))
    notificationTimers.current = []
  }

  return (
    <NotificationContext.Provider
      value={{
        requestPermission,
        hasPermission,
        scheduleNotification,
        sendNotification,
        cancelAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
