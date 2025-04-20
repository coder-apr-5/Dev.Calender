"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Play, Trash2, Loader2 } from "lucide-react"
import piston from 'piston-client'

const pClient = piston({server:"https://emkc.org"})

// Judge0 API integration
const compileAndRun = async (code: string, language: string): Promise<{ output: string; error: string | null }> => {
  const languageIds = (await pClient.runtimes()).map((e:{language:string, runtime:string, version: string}) => {
    const rt: {[key:string]: string} = {}
    rt[e.language] = e.version
    return rt
  }).reduce((a,b) => ({...a, ...b}))
  try {
    // Show loading state for at least 1 second to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(language)
    // Prepare request payload
    const payload = {
      source_code: code,
      language_id: language,
      stdin: "",
    }
    const response = await pClient.execute({"language":language,
      version: languageIds[language],
      "files":[{"content":payload.source_code}],
      "stdin":"","args":["1","2","3"],
      "compile_timeout":10000,
      "run_timeout":3000,
      "compile_memory_limit":-1,
      "run_memory_limit":-1})

    const token = response.run.output

    return {
      output: token,
      error: null,
    }
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export default function TerminalPage() {
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState<string>("python")
  const [isRunning, setIsRunning] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  // Set default code for each language
  useEffect(() => {
    switch (language) {
      case "python":
        setCode(
          '# Python code example\nprint("Hello, Developer!")\n\n# Try a simple calculation\nresult = 0\nfor i in range(1, 11):\n    result += i\nprint(f"Sum of numbers 1 to 10: {result}")',
        )
        break
      case "c":
        setCode(
          '#include <stdio.h>\n\nint main() {\n    printf("Hello, Developer!\\n");\n    \n    // Try a simple calculation\n    int result = 0;\n    for (int i = 1; i <= 10; i++) {\n        result += i;\n    }\n    printf("Sum of numbers 1 to 10: %d\\n", result);\n    \n    return 0;\n}',
        )
        break
      case "c++":
        setCode(
          '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, Developer!" << endl;\n    \n    // Try a simple calculation\n    int result = 0;\n    for (int i = 1; i <= 10; i++) {\n        result += i;\n    }\n    cout << "Sum of numbers 1 to 10: " << result << endl;\n    \n    return 0;\n}',
        )
        break
      case "java":
        setCode(
          'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Developer!");\n        \n        // Try a simple calculation\n        int result = 0;\n        for (int i = 1; i <= 10; i++) {\n            result += i;\n        }\n        System.out.println("Sum of numbers 1 to 10: " + result);\n    }\n}',
        )
        break
      case "go":
        setCode(
          'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Developer!")\n    \n    // Try a simple calculation\n    result := 0\n    for i := 1; i <= 10; i++ {\n        result += i\n    }\n    fmt.Printf("Sum of numbers 1 to 10: %d\\n", result)\n}',
        )
        break
    }
  }, [language])

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")
    setError(null)

    try {
      const result = await compileAndRun(code, language)

      if (result.error) {
        //setError(result.error)
        toast({
          title: "Compilation Error",
          description: "Your code has syntax errors. Check the output panel.",
          variant: "destructive",
        })
      } else {
        setOutput(result.output)
        toast({
          title: "Code executed",
          description: "Your code has been executed successfully.",
        })
      }
    } catch (error) {
      setError(`Error: ${error instanceof Error ? (error as Error).message : "An unknown error occurred"}`)
      toast({
        title: "Execution failed",
        description: "There was an error executing your code.",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const clearTerminal = () => {
    setOutput("")
    setError(null)
    toast({
      title: "Terminal cleared",
      description: "The terminal output has been cleared.",
    })
  }

  const handleTabIndent = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = code.substring(0, start) + "    " + code.substring(end)
      setCode(newValue)

      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = start + 4
          editorRef.current.selectionEnd = start + 4
        }
      }, 0)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Terminal</h1>
          <p className="text-muted-foreground">Write and execute code in multiple programming languages</p>
        </div>

        <Tabs
          defaultValue="python"
          value={language}
          onValueChange={(value) => setLanguage(value)}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-5 w-full max-w-md">
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="c">C</TabsTrigger>
              <TabsTrigger value="c++">C++</TabsTrigger>
              <TabsTrigger value="java">Java</TabsTrigger>
              <TabsTrigger value="go">Go</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button onClick={runCode} disabled={isRunning} className="bg-green-600 hover:bg-green-700">
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={clearTerminal} disabled={isRunning || (!output && !error)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <Card className="col-span-1">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-medium">Code Editor</CardTitle>
                {error && <CardDescription className="text-red-500 text-xs">{error}</CardDescription>}
              </CardHeader>
              <CardContent className="p-0">
                <textarea
                  ref={editorRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleTabIndent}
                  className={`w-full h-[500px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 resize-none focus:outline-none ${
                    error ? "border-l-4 border-red-500" : ""
                  }`}
                  spellCheck="false"
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-medium">Output</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-[500px] p-4 font-mono text-sm bg-black text-green-400 overflow-auto whitespace-pre-wrap">
                  {isRunning ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-green-400 mb-4" />
                      <p>Compiling and running your code...</p>
                    </div>
                  ) : error ? (
                    <div className="text-red-400">{error}</div>
                  ) : output ? (
                    output
                  ) : (
                    "// Output will appear here after running your code"
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </Tabs>

        <Tabs defaultValue="python" value={language} className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Language Reference</CardTitle>
              <CardDescription>Quick reference for the selected programming language</CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="python" className="mt-0">
                <h3 className="text-lg font-medium mb-2">Python</h3>
                <p className="mb-4">
                  Python is a high-level, interpreted programming language known for its readability and simplicity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Common Functions</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <code>print()</code> - Output text
                      </li>
                      <li>
                        <code>len()</code> - Get length of a sequence
                      </li>
                      <li>
                        <code>range()</code> - Generate a sequence of numbers
                      </li>
                      <li>
                        <code>input()</code> - Read user input
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Data Structures</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <code>list</code> - Ordered, mutable collection
                      </li>
                      <li>
                        <code>dict</code> - Key-value pairs
                      </li>
                      <li>
                        <code>tuple</code> - Ordered, immutable collection
                      </li>
                      <li>
                        <code>set</code> - Unordered collection of unique items
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="c" className="mt-0">
                <h3 className="text-lg font-medium mb-2">C</h3>
                <p className="mb-4">
                  C is a general-purpose, procedural programming language that provides low-level memory access.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Common Functions</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <code>printf()</code> - Output formatted text
                      </li>
                      <li>
                        <code>scanf()</code> - Read formatted input
                      </li>
                      <li>
                        <code>malloc()</code> - Allocate memory
                      </li>
                      <li>
                        <code>free()</code> - Free allocated memory
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Data Types</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <code>int</code> - Integer
                      </li>
                      <li>
                        <code>float</code> - Floating-point number
                      </li>
                      <li>
                        <code>char</code> - Character
                      </li>
                      <li>
                        <code>struct</code> - Custom data structure
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="c++" className="mt-0">
                <h3 className="text-lg font-medium mb-2">C++</h3>
                <p className="mb-4">
                  C++ is a general-purpose programming language that extends C with object-oriented features.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Common Functions</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <code>cout</code> - Output stream
                      </li>
                      <li>
                        <code>cin</code> - Input stream
                      </li>
                      <li>
                        <code>new</code> - Allocate memory
                      </li>
                      <li>
                        <code>delete</code> - Free allocated memory
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Data Structures</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <code>vector</code> - Dynamic array
                      </li>
                      <li>
                        <code>map</code> - Key-value pairs
                      </li>
                      <li>
                        <code>string</code> - Text string
                      </li>
                      <li>
                        <code>class</code> - Custom data type with methods
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="java" className="mt-0">
                <h3 className="text-lg font-medium mb-2">Java</h3>
                <p className="mb-4">
                  Java is a class-based, object-oriented programming language designed to have minimal implementation
                  dependencies.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Common Methods</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <code>System.out.println()</code> - Output text
                      </li>
                      <li>
                        <code>Scanner</code> - Read input
                      </li>
                      <li>
                        <code>String.length()</code> - Get string length
                      </li>
                      <li>
                        <code>ArrayList.add()</code> - Add to list
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Data Structures</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <code>ArrayList</code> - Dynamic array
                      </li>
                      <li>
                        <code>HashMap</code> - Key-value pairs
                      </li>
                      <li>
                        <code>String</code> - Text string
                      </li>
                      <li>
                        <code>Class</code> - Blueprint for objects
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="go" className="mt-0">
                <h3 className="text-lg font-medium mb-2">Go</h3>
                <p className="mb-4">
                  Go is a statically typed, compiled programming language designed at Google, known for simplicity and
                  efficiency.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Common Functions</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <code>fmt.Println()</code> - Output text
                      </li>
                      <li>
                        <code>len()</code> - Get length of a collection
                      </li>
                      <li>
                        <code>append()</code> - Add to slice
                      </li>
                      <li>
                        <code>make()</code> - Allocate and initialize
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Data Structures</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <code>slice</code> - Dynamic array
                      </li>
                      <li>
                        <code>map</code> - Key-value pairs
                      </li>
                      <li>
                        <code>struct</code> - Custom data structure
                      </li>
                      <li>
                        <code>interface</code> - Method signature set
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  )
}
