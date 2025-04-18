"use client"

import type React from "react"

// Create a proper implementation instead of re-exporting
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string | null
  email: string
  image: string | null
}

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Simulate checking for an existing session
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate authentication
      const mockUser: User = {
        id: "user-1",
        name: email.split("@")[0],
        email,
        image: null,
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/calendar")
    } catch (error) {
      console.error("Failed to sign in:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    try {
      // Simulate Google authentication
      const mockUser: User = {
        id: "google-user-1",
        name: "Google User",
        email: "user@gmail.com",
        image: "/placeholder.svg?height=40&width=40&text=GU",
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/calendar")
    } catch (error) {
      console.error("Failed to sign in with Google:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate registration
      const mockUser: User = {
        id: "user-" + Date.now(),
        name,
        email,
        image: null,
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/calendar")
    } catch (error) {
      console.error("Failed to sign up:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
