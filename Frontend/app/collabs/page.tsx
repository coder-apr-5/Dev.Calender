"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Github, Star, GitFork, Users, ExternalLink } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Repository = {
  id: number
  name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  }
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  topics: string[]
  collaborators: string[]
}

export default function CollabsPage() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const { user } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  // Mock repositories data
  useEffect(() => {
    const mockRepos: Repository[] = [
      {
        id: 1,
        name: "dev-calendar",
        description: "A specialized calendar application designed for developers to manage their time efficiently.",
        owner: {
          login: "devteam",
          avatar_url: "/placeholder.svg?height=40&width=40&text=DT",
        },
        html_url: "https://github.com/devteam/dev-calendar",
        stargazers_count: 128,
        forks_count: 32,
        language: "TypeScript",
        topics: ["calendar", "developer-tools", "react", "nextjs"],
        collaborators: ["Alex Johnson", "Samantha Chen", "Michael Rodriguez"],
      },
      {
        id: 2,
        name: "code-compiler",
        description: "A multi-language code compiler that supports Python, C, C++, Java, and Go.",
        owner: {
          login: "devteam",
          avatar_url: "/placeholder.svg?height=40&width=40&text=DT",
        },
        html_url: "https://github.com/devteam/code-compiler",
        stargazers_count: 87,
        forks_count: 21,
        language: "JavaScript",
        topics: ["compiler", "developer-tools", "multi-language"],
        collaborators: ["Alex Johnson", "Michael Rodriguez"],
      },
      {
        id: 3,
        name: "github-collab",
        description: "A tool for managing GitHub collaborations and tracking project progress.",
        owner: {
          login: "devteam",
          avatar_url: "/placeholder.svg?height=40&width=40&text=DT",
        },
        html_url: "https://github.com/devteam/github-collab",
        stargazers_count: 64,
        forks_count: 15,
        language: "TypeScript",
        topics: ["github", "collaboration", "project-management"],
        collaborators: ["Samantha Chen", "Michael Rodriguez"],
      },
      {
        id: 4,
        name: "dev-dashboard",
        description: "A comprehensive dashboard for developers to monitor their projects and tasks.",
        owner: {
          login: "devteam",
          avatar_url: "/placeholder.svg?height=40&width=40&text=DT",
        },
        html_url: "https://github.com/devteam/dev-dashboard",
        stargazers_count: 112,
        forks_count: 28,
        language: "TypeScript",
        topics: ["dashboard", "developer-tools", "react", "analytics"],
        collaborators: ["Alex Johnson", "Samantha Chen"],
      },
      {
        id: 5,
        name: "code-snippets",
        description: "A collection of useful code snippets for various programming languages and frameworks.",
        owner: {
          login: "devteam",
          avatar_url: "/placeholder.svg?height=40&width=40&text=DT",
        },
        html_url: "https://github.com/devteam/code-snippets",
        stargazers_count: 95,
        forks_count: 42,
        language: "JavaScript",
        topics: ["snippets", "code-examples", "multi-language"],
        collaborators: ["Alex Johnson", "Samantha Chen", "Michael Rodriguez"],
      },
    ]

    setRepositories(mockRepos)
  }, [])

  // Filter repositories based on search term and filter
  useEffect(() => {
    let filtered = [...repositories]

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          repo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          repo.topics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply filter
    if (filter === "active") {
      filtered = filtered.filter((repo) => repo.collaborators.length > 1)
    } else if (filter === "completed") {
      filtered = filtered.filter((repo) => repo.stargazers_count > 100)
    }

    setFilteredRepos(filtered)
  }, [repositories, searchTerm, filter])

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      TypeScript: "bg-blue-500",
      JavaScript: "bg-yellow-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      Go: "bg-cyan-500",
      "C++": "bg-purple-500",
      C: "bg-gray-500",
    }

    return colors[language] || "bg-gray-500"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Collaborations</h1>
            <p className="text-muted-foreground">Manage your GitHub projects and collaborations</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
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
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {filteredRepos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center h-64">
              <Github className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No repositories found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm
                  ? "Try adjusting your search or filter criteria"
                  : "Add GitHub repositories to see them here"}
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => (
              <Link
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full transition-transform hover:scale-[1.02]"
              >
                <Card className="flex flex-col h-full cursor-pointer hover:border-purple-400 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={repo.owner.avatar_url || "/placeholder.svg"} alt={repo.owner.login} />
                        <AvatarFallback>{repo.owner.login.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{repo.owner.login}</span>
                    </div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {repo.name}
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{repo.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {repo.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{repo.topics.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className={`h-3 w-3 rounded-full ${getLanguageColor(repo.language)}`} />
                        {repo.language}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {repo.stargazers_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        {repo.forks_count}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {repo.collaborators.length} collaborators
                          </span>
                        </div>
                        <Github className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex -space-x-2">
                        {repo.collaborators.slice(0, 3).map((collaborator, index) => (
                          <Avatar key={index} className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="bg-purple-500 text-white text-xs">
                              {collaborator
                                .split(" ")
                                .map((name) => name[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {repo.collaborators.length > 3 && (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-background bg-muted text-xs font-medium">
                            +{repo.collaborators.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
