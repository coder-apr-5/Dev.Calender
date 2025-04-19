"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Code, Github, Linkedin, Mail, Phone } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  // Mock user profile data
  const userProfile = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    image: user?.image || "/placeholder.svg?height=128&width=128&text=U",
    role: "Full Stack Developer",
    location: "San Francisco, CA",
    bio: "Passionate developer with expertise in React, Next.js, and TypeScript. Love building tools that make developers' lives easier.",
    github: "github.com/devuser",
    linkedin: "linkedin.com/in/devuser",
    phone: "+1 (555) 123-4567",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "GraphQL", "Docker"],
    activity: [
      {
        type: "event",
        title: "Team Meeting",
        date: "Today, 2:00 PM",
      },
      {
        type: "code",
        title: "Pushed 5 commits to dev-calendar",
        date: "Yesterday",
      },
      {
        type: "event",
        title: "Code Review Session",
        date: "Mar 15, 2023",
      },
      {
        type: "code",
        title: "Merged PR #42: Fix calendar rendering",
        date: "Mar 14, 2023",
      },
    ],
    projects: [
      {
        name: "Dev Calendar",
        description: "A specialized calendar for developers",
        role: "Lead Developer",
        progress: 75,
      },
      {
        name: "Code Compiler",
        description: "Multi-language code compiler",
        role: "Backend Developer",
        progress: 60,
      },
      {
        name: "GitHub Collab",
        description: "GitHub collaboration tool",
        role: "Frontend Developer",
        progress: 90,
      },
    ],
  }

  if (!user) {
    return null // Don't render anything if not logged in
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">View and manage your profile information</p>
          </div>
          <Button onClick={() => router.push("/profile/settings")}>Edit Profile</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <Card className="col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={userProfile.image || "/placeholder.svg"} alt={userProfile.name} />
                  <AvatarFallback className="text-4xl">{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                <p className="text-purple-600 font-medium">{userProfile.role}</p>
                <p className="text-muted-foreground mt-1">{userProfile.location}</p>
                <div className="mt-6 w-full">
                  <p className="text-left text-sm">{userProfile.bio}</p>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{userProfile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Github className="h-4 w-4 text-muted-foreground" />
                      <Link
                        href={`https://${userProfile.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-600"
                      >
                        {userProfile.github}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                      <Link
                        href={`https://${userProfile.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-600"
                      >
                        {userProfile.linkedin}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mt-6 w-full">
                  <h3 className="text-left font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                    <CardDescription>A summary of your profile and information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Bio</h3>
                        <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Current Projects</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {userProfile.projects.map((project) => (
                            <li key={project.name}>
                              <span className="font-medium">{project.name}</span> - {project.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Recent Activity</h3>
                        <div className="space-y-3">
                          {userProfile.activity.slice(0, 2).map((activity, index) => (
                            <div key={index} className="flex items-start gap-3">
                              {activity.type === "event" ? (
                                <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                              ) : (
                                <Code className="h-5 w-5 text-purple-600 mt-0.5" />
                              )}
                              <div>
                                <p className="text-sm">{activity.title}</p>
                                <p className="text-xs text-muted-foreground">{activity.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>Your recent events and code activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {userProfile.activity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                          {activity.type === "event" ? (
                            <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                          ) : (
                            <Code className="h-5 w-5 text-purple-600 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>Projects you're currently working on</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {userProfile.projects.map((project) => (
                        <div key={project.name} className="pb-4 border-b last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{project.name}</h3>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                            </div>
                            <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 px-2 py-1 rounded">
                              {project.role}
                            </span>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between items-center mb-1 text-xs">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
