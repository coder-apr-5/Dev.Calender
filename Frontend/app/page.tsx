import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CalendarDays, Code2, Github } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Welcome to the Calendar for Developers
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Organize your coding schedule, manage events, and collaborate with other developers all in one place.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/calendar">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 p-2">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-sm">
                    <div className="grid grid-cols-7 gap-2 text-center">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div key={day} className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 31 }, (_, i) => (
                        <div
                          key={i}
                          className={`aspect-square flex items-center justify-center rounded-md text-sm ${
                            i === 14
                              ? "bg-yellow-500 text-white"
                              : i === 21
                                ? "bg-red-500 text-white"
                                : i === 7
                                  ? "bg-green-500 text-white"
                                  : "bg-white/90 dark:bg-gray-800"
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Mission</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                To create the most intuitive and powerful calendar tool specifically designed for developers' unique
                needs, helping them manage their time efficiently while integrating with their development workflow.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <CalendarDays className="h-8 w-8 text-purple-500" />
                <div className="grid gap-1">
                  <CardTitle>Smart Scheduling</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Intelligently organize your coding sessions, meetings, and deadlines with color-coded priorities.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Code2 className="h-8 w-8 text-purple-500" />
                <div className="grid gap-1">
                  <CardTitle>Built-in Terminal</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Test your code snippets directly within the app using our integrated multi-language compiler.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Github className="h-8 w-8 text-purple-500" />
                <div className="grid gap-1">
                  <CardTitle>GitHub Integration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with collaborators and manage your GitHub projects without leaving the calendar.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Us</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                We are a team of passionate developers who understand the challenges of managing time in the fast-paced
                world of software development.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
            {[
              {
                name: "Apurba Roy",
                role: "Frontend Developer",
                bio: "Specializes in creating intuitive user interfaces with React and Next.js.",
                img: '/apurba.jpg'
              },
              {
                name: "Soumalya Ghosh",
                role: "Backend Developer",
                bio: "Expert in building robust APIs and database architectures.",
                img: '/soumalya.jpg'
              },
              {
                name: "Krishanu Roy",
                role: "Ideation Lead",
                bio: "A chill guy who brings innovative ideas to life.",
                img: '/krishanu.jpg'
              },
            ].map((developer, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-center">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={developer.img}
                        alt={developer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{developer.name}</CardTitle>
                  <CardDescription className="text-purple-500 font-medium">{developer.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">{developer.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
