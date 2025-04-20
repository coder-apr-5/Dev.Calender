"use client"

import React from "react"

// Create a proper implementation instead of re-exporting
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loginUser, logout, registerUser } from "./useApi"

type User = {
  id: string
  name: string | null
  email: string
  image: string | null
}

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
  isLoading: boolean
}

const AuthContext: React.Context<AuthContextType | undefined> = createContext<AuthContextType | undefined>(undefined)

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
      const {userId, access_token, name} = await loginUser(email, password)
      setUser({email, id: userId, name, image: null})
      localStorage.setItem("user", JSON.stringify({email, password}))
      
      router.push("/calendar")
    } catch (error) {
      console.error("Failed to sign in:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate registration
      const user = await registerUser(name, email, password)
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/calendar")
    } catch (error) {
      console.error("Failed to sign up:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    await logout()
    setUser(null)
    localStorage.clear()
    sessionStorage.clear()
    router.push("/")
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
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
