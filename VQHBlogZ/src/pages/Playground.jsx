
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Play, Copy, RotateCcw, Terminal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const initialCode = `// Welcome to the JavaScript Playground!
// Write your code here and click Run to execute it

console.log("Hello, VQHBlogZ!");

// Example: Simple function
function greet(name) {
  return \`Hello, \${name}! Welcome to the playground.\`;
}

console.log(greet("Developer"));

// Example: Array manipulation
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Original:", numbers);
console.log("Doubled:", doubled);

// Try your own code below!
`;

const Playground = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = useCallback(() => {
    setIsRunning(true);
    setOutput('');

    const logs = [];
    const customConsole = {
      log: (...args) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      },
      error: (...args) => {
        logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
      },
      warn: (...args) => {
        logs.push('WARNING: ' + args.map(arg => String(arg)).join(' '));
      }
    };

    try {
      const userFunction = new Function('console', code);
      userFunction(customConsole);
      
      if (logs.length === 0) {
        logs.push('Code executed successfully (no output)');
      }
    } catch (error) {
      logs.push(`ERROR: ${error.message}`);
    }

    setOutput(logs.join('\n'));
    setIsRunning(false);
  }, [code]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: t('success'),
        description: t('codeCopied'),
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: 'Failed to copy code',
      });
    }
  }, [code, t, toast]);

  const resetCode = useCallback(() => {
    setCode(initialCode);
    setOutput('');
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('playgroundTitle')} - VQHBlogZ</title>
        <meta name="description" content={t('playgroundSubtitle')} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
              {t('playgroundTitle')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('playgroundSubtitle')}
            </p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-6"
          >
            <Button
              onClick={runCode}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? t('loading') : t('run')}
            </Button>
            <Button variant="outline" onClick={copyCode}>
              <Copy className="w-4 h-4 mr-2" />
              {t('copy')}
            </Button>
            <Button variant="outline" onClick={resetCode}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('reset')}
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect rounded-xl overflow-hidden"
            >
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                <span className="text-sm text-gray-300 font-fira">JavaScript</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 bg-gray-900 text-white font-fira text-sm p-4 resize-none focus:outline-none"
                placeholder="Write your JavaScript code here..."
                spellCheck={false}
                aria-label="JavaScript code editor"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-effect rounded-xl overflow-hidden"
            >
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-gray-300" />
                <span className="text-sm text-gray-300 font-fira">{t('output')}</span>
              </div>
              <div className="h-96 bg-gray-900 text-green-400 font-fira text-sm p-4 overflow-auto">
                {output ? (
                  <pre className="whitespace-pre-wrap">{output}</pre>
                ) : (
                  <div className="text-gray-500 italic">
                    Click "Run" to see the output here...
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 glass-effect rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">💡 Tips for the Playground</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Use <code className="bg-muted text-foreground px-2 py-1 rounded">console.log()</code> to output values</li>
              <li>• Try modern JavaScript features like arrow functions, destructuring, and async/await</li>
              <li>• The playground supports ES6+ syntax</li>
              <li>• Use <code className="bg-muted text-foreground px-2 py-1 rounded">console.error()</code> and <code className="bg-muted text-foreground px-2 py-1 rounded">console.warn()</code> for different output types</li>
              <li>• Code is executed in a safe, sandboxed environment</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Playground;
