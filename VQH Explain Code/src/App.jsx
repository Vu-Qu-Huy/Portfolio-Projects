import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Code2, Sparkles } from "lucide-react";
import { CodeExplainer } from "@/components/CodeExplainer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Helmet>
        <title>VQH Explain Code – AI-Powered Code Explainer</title>
        <meta
          name="description"
          content="Paste JavaScript or Python code and get instant AI-powered explanations in plain English. Free code analysis tool powered by Google's Gemini AI."
        />
      </Helmet>

      <div className="min-h-screen gradient-bg">
        <ThemeToggle />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center items-center mb-6"
            >
              <div className="relative">
                <Code2 className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                <Sparkles className="h-8 w-8 text-yellow-500 dark:text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="font-orbitron text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 dark:from-purple-400 dark:via-blue-400 dark:to-purple-500 bg-clip-text text-transparent"
            >
              VQH Explain Code
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Paste any of your JS or Py code in here, let my Gemini AI free API
              key handle the rest, hopefully.
            </motion.p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <CodeExplainer />
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center mt-16 py-8"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by Google's Gemini 2.5 Flash AI, just don't abuse it too
              much, please.
            </p>
          </motion.footer>
        </div>

        <Toaster />
      </div>
    </>
  );
}

export default App;
