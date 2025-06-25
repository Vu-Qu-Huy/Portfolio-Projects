
import React from 'react';
import { Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const CodeBlock = ({ language, code }) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: 'Success',
        description: 'Code copied to clipboard!',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy code',
      });
    }
  };

  const highlightCode = (code, language) => {
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    if (language === 'javascript' || language === 'js') {
      highlighted = highlighted
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|new|this|super|extends|try|catch|finally|throw|delete|typeof|instanceof)\b/g, '<span class="keyword">$1</span>')
        .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/`([\s\S]*?)`/g, '<span class="string">`$1`</span>')
        .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="boolean">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
        .replace(/\b([A-Z][a-zA-Z0-9_$]*)/g, '<span class="class-name">$1</span>')
        .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="function">$1</span>(');
    } else if (language === 'css') {
      highlighted = highlighted
        .replace(/([a-zA-Z-]+)(?=\s*:)/g, '<span class="keyword">$1</span>')
        .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/#([a-fA-F0-9]{3,6})\b/g, '<span class="number">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
    } else if (language === 'html') {
      highlighted = highlighted
        .replace(/&lt;(\/?[a-zA-Z0-9-:]+)/g, '&lt;<span class="keyword">$1</span>')
        .replace(/([a-zA-Z-]+)=/g, '<span class="attribute">$1</span>=')
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>');
    }
    
    return highlighted;
  };

  return (
    <div className="relative my-6">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
        <span className="text-sm text-gray-300 font-fira">{language || 'code'}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="text-gray-300 hover:text-white"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <div className="code-block rounded-t-none">
        <pre className="font-fira">
          <code
            dangerouslySetInnerHTML={{
              __html: highlightCode(code, language)
            }}
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
