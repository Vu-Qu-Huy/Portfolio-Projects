
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CodeEditor = ({ value, onChange, language, placeholder }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.max(200, textareaRef.current.scrollHeight) + 'px';
    }
  }, [value]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <div className="code-block overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30">
          <span className="text-sm font-medium text-muted-foreground">
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
          </div>
        </div>
        
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[200px] p-4 bg-transparent border-none outline-none resize-none code-editor text-foreground placeholder:text-muted-foreground"
          spellCheck={false}
        />
      </div>
    </motion.div>
  );
};

export default CodeEditor;
