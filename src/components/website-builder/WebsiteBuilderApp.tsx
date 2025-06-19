
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Download, History, Sparkles, Globe, Accessibility, Zap } from 'lucide-react';
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

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe what kind of website you want to build.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await geminiWebsiteService.generateWebsite(description);
      
      const newWebsite: GeneratedWebsite = {
        id: Date.now().toString(),
        description,
        html: result.html,
        instructions: result.instructions,
        timestamp: new Date().toISOString()
      };

      setGeneratedWebsite(newWebsite);
      setHistory(prev => [newWebsite, ...prev.slice(0, 9)]);
      
      toast({
        title: "Website Generated Successfully!",
        description: "Your accessible website is ready to use."
      });
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadHtml = (html: string, filename: string = 'website.html') => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const accessibilityFeatures = [
    'Semantic HTML structure',
    'ARIA labels and roles',
    'Keyboard navigation support',
    'High contrast colors',
    'Large touch targets (44px+)',
    'Screen reader compatibility',
    'Focus indicators',
    'Responsive design'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-12 w-12 text-green-400" />
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mb-4">
            AI Website Builder
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into fully accessible web applications instantly. 
            Simply describe what you need in plain English and watch sophisticated, 
            WCAG 2.1 AA compliant websites come to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Examples Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-yellow-400" />
                    Try These Ideas
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {examples.map((example, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDescription(example)}
                        className="p-3 text-left bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-gray-200 text-sm transition-all duration-200"
                      >
                        💡 {example}
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Generator Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Describe Your Website
                  </h2>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="I need a voice-controlled shopping list that works with screen readers..."
                    className="min-h-32 bg-white/10 border-white/20 text-white placeholder-gray-400 resize-none"
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !description.trim()}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-3 text-lg"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Sparkles className="h-5 w-5" />
                        </motion.div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Accessible Website
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Generated Website Preview */}
            <AnimatePresence>
              {generatedWebsite && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          <Globe className="h-6 w-6 text-green-400" />
                          Your Website
                        </h3>
                        <Button
                          onClick={() => downloadHtml(generatedWebsite.html)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <iframe
                          title="Generated Website"
                          srcDoc={generatedWebsite.html}
                          className="w-full h-96 border-0 rounded"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Usage Instructions</h3>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                          {generatedWebsite.instructions}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Accessibility Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Accessibility className="h-6 w-6 text-green-400" />
                    Accessibility Features
                  </h3>
                  <ul className="space-y-2">
                    {accessibilityFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <History className="h-6 w-6 text-blue-400" />
                    Recent Websites
                  </h3>
                  {history.length === 0 ? (
                    <p className="text-gray-400 text-sm">No websites generated yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {history.slice(0, 5).map((website) => (
                        <div
                          key={website.id}
                          className="p-3 bg-white/10 rounded-lg border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                          onClick={() => setGeneratedWebsite(website)}
                        >
                          <p className="text-white text-sm font-medium mb-1">
                            Website #{history.indexOf(website) + 1}
                          </p>
                          <p className="text-gray-300 text-xs line-clamp-2">
                            {website.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-gray-400 text-xs">
                              {new Date(website.timestamp).toLocaleDateString()}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadHtml(website.html, `website_${website.id}.html`);
                              }}
                              className="h-6 px-2 text-xs text-green-400 hover:text-green-300"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {history.length > 5 && (
                        <p className="text-gray-400 text-xs text-center">
                          +{history.length - 5} more websites
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
