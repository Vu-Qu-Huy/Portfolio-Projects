import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Code, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { supabase } from '@/lib/customSupabaseClient';

export function CodeExplainer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleExplain = async () => {
    if (!code.trim()) {
      toast({
        title: "No code provided",
        description: "Please paste some code to explain!",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('explain-code', {
        body: JSON.stringify({ 
          code: code.trim(), 
          language 
        })
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setExplanation(data.explanation);
      
      toast({
        title: "Code explained! 🎉",
        description: "Your code has been successfully analyzed by Gemini AI.",
      });
    } catch (error) {
      console.error('Error explaining code:', error);
      toast({
        title: "Explanation failed",
        description: error.message || "Failed to explain the code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied! 📋",
        description: "Explanation copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleClear = () => {
    setCode('');
    setExplanation('');
    setLanguage('javascript');
    setCopied(false);
    toast({
      title: "Cleared! ✨",
      description: "Form has been reset.",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Input Section */}
      <Card className="code-area glow-effect">
        <CardHeader>
          <CardTitle className="font-orbitron text-2xl flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Code className="h-6 w-6" />
            Code Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Programming Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="font-fira">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-end">
              <Button
                onClick={handleExplain}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="spinner mr-2" />
                    Explaining...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Explain
                  </>
                )}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                disabled={isLoading}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Paste your code here
            </label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Paste your ${language} code here...`}
              className="min-h-[300px] font-fira text-sm resize-none bg-white/50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-600"
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      <AnimatePresence>
        {explanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="explanation-card glow-effect border-purple-200 dark:border-purple-700">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-t-lg">
                <CardTitle className="font-orbitron text-2xl flex items-center justify-between text-gray-800 dark:text-gray-200">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    AI Explanation
                  </span>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="max-w-none"
                >
                  <MarkdownRenderer 
                    content={explanation} 
                    className="text-base leading-relaxed"
                  />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}