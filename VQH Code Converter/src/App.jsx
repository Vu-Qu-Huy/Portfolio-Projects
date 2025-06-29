import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Code2,
  ArrowRightLeft,
  Copy,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import CodeEditor from "@/components/CodeEditor";
import CodeOutput from "@/components/CodeOutput";

const LANGUAGES = [
  {
    value: "javascript",
    label: "JavaScript",
    example:
      'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
  },
  {
    value: "python",
    label: "Python",
    example:
      'def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))',
  },
  {
    value: "java",
    label: "Java",
    example:
      'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  },
  {
    value: "cpp",
    label: "C++",
    example:
      '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  },
  {
    value: "c",
    label: "C",
    example:
      '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  },
  {
    value: "csharp",
    label: "C#",
    example:
      'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
  },
  {
    value: "typescript",
    label: "TypeScript",
    example:
      'function greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
  },

  {
    value: "ruby",
    label: "Ruby",
    example: 'def greet(name)\n  "Hello, #{name}!"\nend\n\nputs greet("World")',
  },
  {
    value: "go",
    label: "Go",
    example:
      'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
  },
];

function App() {
  const [isDark, setIsDark] = useState(true);
  const [sourceCode, setSourceCode] = useState("");
  const [sourceLang, setSourceLang] = useState("javascript");
  const [targetLang, setTargetLang] = useState("python");
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("javascript");
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle("light", !isDark);
  }, [isDark]);

  useEffect(() => {
    const selectedLang = LANGUAGES.find((lang) => lang.value === activeTab);
    if (selectedLang) {
      setSourceCode(selectedLang.example);
      setSourceLang(activeTab);
    }
  }, [activeTab]);

  const handleConvert = async () => {
    if (!sourceCode.trim()) {
      toast({
        title: "⚠️ Empty Code",
        description: "Please enter some code to convert!",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    setResult(null);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      toast({
        title: "❌ Configuration Error",
        description: "Supabase URL or Anon Key is missing.",
        variant: "destructive",
      });
      setIsConverting(false);
      return;
    }

    const functionUrl = `${supabaseUrl}/functions/v1/code-converter`;

    try {
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: sourceCode,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.convertedCode || !data.explanation) {
        throw new Error("Invalid response from the conversion service.");
      }

      setResult(data);

      toast({
        title: "✨ Conversion Complete!",
        description: "Your code has been successfully converted!",
      });
    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "❌ Conversion Failed",
        description: error.message || "Something went wrong. Please try again!",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const swapLanguages = () => {
    const newSourceLang = targetLang;
    const newTargetLang = sourceLang;
    setSourceLang(newSourceLang);
    setTargetLang(newTargetLang);

    const newSourceExample =
      LANGUAGES.find((lang) => lang.value === newSourceLang)?.example || "";
    setSourceCode(newSourceExample);
    setActiveTab(newSourceLang);
    setResult(null);
  };

  return (
    <>
      <Helmet>
        <title>VQH Code Converter - AI-Powered Code Translation</title>
        <meta
          name="description"
          content="Convert code between programming languages instantly with AI. Support for JavaScript, Python, Java, C++, Rust, and more."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Code2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  VQH Code Converter
                </h1>
                <p className="text-muted-foreground">
                  AI-powered code translation
                </p>
              </div>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-xl p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-2">From</label>
                <Select
                  value={sourceLang}
                  onValueChange={(value) => {
                    setSourceLang(value);
                    const lang = LANGUAGES.find((l) => l.value === value);
                    if (lang) setSourceCode(lang.example);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={swapLanguages}
                className="rounded-full mt-6 md:mt-0"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>

              <div className="flex-1 w-full">
                <label className="block text-sm font-medium mb-2">To</label>
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Source Code</h2>
            </div>

            <CodeEditor
              value={sourceCode}
              onChange={setSourceCode}
              language={sourceLang}
              placeholder="Paste your code here..."
            />

            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleConvert}
                disabled={isConverting || !sourceCode.trim()}
                size="lg"
                className="px-8"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Convert Code
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <CodeOutput
                title="Converted Code"
                content={result.convertedCode}
                language={targetLang}
                icon={<Code2 className="h-5 w-5" />}
              />

              <CodeOutput
                title="Explanation"
                content={result.explanation}
                language="text"
                icon={<Sparkles className="h-5 w-5" />}
              />
            </motion.div>
          )}
        </div>

        <Toaster />
      </div>
    </>
  );
}

export default App;
