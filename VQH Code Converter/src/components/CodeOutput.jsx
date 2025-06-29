import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-go";
import "prismjs/components/prism-typescript";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const CodeOutput = ({ title, content, language, icon }) => {
  const [copied, setCopied] = useState(false);
  const [highlightedContent, setHighlightedContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (
      language &&
      language !== "text" &&
      content &&
      Prism.languages[language]
    ) {
      try {
        const highlighted = Prism.highlight(
          content,
          Prism.languages[language],
          language
        );
        setHighlightedContent(highlighted);
      } catch (e) {
        console.error("Prism highlighting failed:", e);
        setHighlightedContent(content);
      }
    } else {
      setHighlightedContent(content);
    }
  }, [content, language]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "📋 Copied!",
        description: "Content copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "❌ Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl overflow-hidden flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold">{title}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="p-4 overflow-auto flex-grow">
        {language === "text" ? (
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        ) : (
          <pre
            className={`code-editor text-sm overflow-x-auto language-${language} bg-transparent`}
          >
            <code
              dangerouslySetInnerHTML={{ __html: highlightedContent }}
              className={`language-${language}`}
            />
          </pre>
        )}
      </div>
    </motion.div>
  );
};

export default CodeOutput;
