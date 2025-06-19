import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Download, History, Sparkles, Globe, Edit, Plus } from 'lucide-react';
import { geminiWebsiteService } from '@/lib/gemini-website-service';

interface GeneratedWebsite {
  id: string;
  description: string;
  html: string;
  instructions: string;
  timestamp: string;
}

export function WebsiteBuilderApp() {
  const [description, setDescription] = useState('');
  const [generatedWebsite, setGeneratedWebsite] = useState<GeneratedWebsite | null>(null);
  const [history, setHistory] = useState<GeneratedWebsite[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [updatePrompt, setUpdatePrompt] = useState('');
  const { toast } = useToast();

  const examples = [
    'A voice-controlled shopping list that works with screen readers',
    'A large-button calculator for people with motor difficulties',
    'A high-contrast daily planner with keyboard shortcuts',
    'A simple timer with visual and audio alerts',
    'A color-blind friendly expense tracker',
    'A voice-activated note-taking app',
    'An accessible photo gallery with keyboard navigation',
    'A screen reader friendly contact form'
  ];

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;
    const recog = new (window as any).webkitSpeechRecognition() as SpeechRecognition;
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = 'en-US';
    recog.onresult = (e: SpeechRecognitionEvent) => {
      setDescription(e.results[0][0].transcript);
    };
    recog.onerror = (e) => {
      console.error('Speech recognition error:', e.error);
    };
    recognitionRef.current = recog;
  }, []);

  const startRecognition = () => recognitionRef.current?.start();
  const stopRecognition = () => recognitionRef.current?.stop();

  const injectViewport = (html: string) => {
    if (html.includes('name="viewport"')) return html;
    return html.replace(
      '<head>',
      '<head><meta name="viewport" content="width=device-width, initial-scale=1">'
    );
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({ title: 'Description Required', description: 'Please describe what you want.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const result = await geminiWebsiteService.generateWebsite(description);
      const html = injectViewport(result.html);
      const newSite: GeneratedWebsite = {
        id: Date.now().toString(),
        description,
        html,
        instructions: result.instructions,
        timestamp: new Date().toISOString()
      };
      setGeneratedWebsite(newSite);
      setHistory(prev => [newSite, ...prev.slice(0, 9)]);
      setUpdateMode(false);
      setUpdatePrompt('');
      toast({ title: 'Website Generated!', description: 'Your site is ready.' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Generation Failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!updatePrompt.trim() || !generatedWebsite) {
      toast({ title: 'Update Prompt Required', description: 'Describe your changes.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const payload = `Update: \"${generatedWebsite.description}\". HTML: ${generatedWebsite.html} Changes: ${updatePrompt}`;
      const result = await geminiWebsiteService.generateWebsite(payload);
      const html = injectViewport(result.html);
      const updated = {
        ...generatedWebsite,
        html,
        instructions: result.instructions,
        timestamp: new Date().toISOString()
      };
      setGeneratedWebsite(updated);
      setHistory(prev => [updated, ...prev.slice(0, 9)]);
      setUpdatePrompt('');
      toast({ title: 'Website Updated!', description: 'Your site has been updated.' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Update Failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetToNew = () => {
    setGeneratedWebsite(null);
    setDescription('');
    setUpdateMode(false);
    setUpdatePrompt('');
  };

  const downloadZip = async (html: string, filename = 'website') => {
    const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
    const jsMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    let clean = html;
    let css = cssMatch.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');
    let js = jsMatch.map(s => s.replace(/<\/?script[^>]*>/gi, '')).join('\n');
    clean = clean
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '<link rel="stylesheet" href="styles.css">')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '<script src="script.js"></script>');
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    zip.file('index.html', clean);
    if (css) zip.file('styles.css', css);
    if (js) zip.file('script.js', js);
    zip.file('README.md',
      `# Website Files\n\n` +
      `## How to Use:\n1. Unzip\n2. Open in VS Code\n3. Open index.html\n\n` +
      `## Files:\n- index.html\n- styles.css\n- script.js\n`
    );
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-12 w-12 text-green-400" />
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">AI Website Builder</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into fully functional web applications instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Examples Section */}
            {!generatedWebsite && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-yellow-400" /> Try These Ideas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {examples.map((example, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setDescription(example)}
                          className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-600 text-gray-200 text-sm"
                        >
                          💡 {example}
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Generator Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">{updateMode ? 'Update Website' : generatedWebsite ? 'Current Website' : 'Describe Your Website'}</h2>
                    {generatedWebsite && (
                      <div className="flex gap-2">
                        <Button onClick={() => setUpdateMode(!updateMode)} className="bg-white text-black hover:bg-gray-100 transition-transform hover:scale-105">
                          <Edit className="mr-2 h-4 w-4" />{updateMode ? 'Cancel Update' : 'Update Website'}
                        </Button>
                        <Button onClick={resetToNew} className="bg-blue-500 hover:bg-blue-600 text-white">
                          <Plus className="mr-2 h-4 w-4" /> Create New Website
                        </Button>
                      </div>
                    )}
                  </div>
                  {updateMode ? (
                    <> ... [update UI omitted for brevity] ...
                    </>
                  ) : (
                    <> ... [generate UI omitted for brevity] ...
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Preview + Instructions */}
            <AnimatePresence>
              {generatedWebsite && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col lg:flex-row lg:items-start space-y-6 lg:space-y-0 lg:space-x-6">
                  {/* Usage Instructions */}
                  <div className="lg:w-1/3"> ... </div>
                  {/* Your Website Preview */}
                  <div className="lg:w-2/3"> ... </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - History */}
          <div className="lg:col-span-1"> ... </div>
        </div>
      </div>
    </div>
  );
}
