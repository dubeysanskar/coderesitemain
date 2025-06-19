
import React, { useState } from 'react';
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
      setUpdateMode(false);
      setUpdatePrompt('');
      
      toast({
        title: "Website Generated Successfully!",
        description: "Your website is ready to use."
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

  const handleUpdate = async () => {
    if (!updatePrompt.trim() || !generatedWebsite) {
      toast({
        title: "Update Prompt Required",
        description: "Please describe what changes you want to make.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const updateDescription = `Update this existing website: "${generatedWebsite.description}". 
      Current HTML: ${generatedWebsite.html}
      
      Update request: ${updatePrompt}`;
      
      const result = await geminiWebsiteService.generateWebsite(updateDescription);
      
      const updatedWebsite: GeneratedWebsite = {
        ...generatedWebsite,
        html: result.html,
        instructions: result.instructions,
        timestamp: new Date().toISOString()
      };

      setGeneratedWebsite(updatedWebsite);
      setHistory(prev => [updatedWebsite, ...prev.slice(0, 9)]);
      setUpdatePrompt('');
      
      toast({
        title: "Website Updated Successfully!",
        description: "Your website has been updated."
      });
    } catch (error) {
      console.error('Update failed:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = async (html: string, filename: string = 'website') => {
    // Extract CSS and JS from HTML
    const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    const jsMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    
    let css = '';
    let js = '';
    let cleanHtml = html;

    // Extract CSS
    if (cssMatch) {
      css = cssMatch.map(style => style.replace(/<\/?style[^>]*>/gi, '')).join('\n');
      cleanHtml = cleanHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '<link rel="stylesheet" href="styles.css">');
    }

    // Extract JS
    if (jsMatch) {
      js = jsMatch.map(script => script.replace(/<\/?script[^>]*>/gi, '')).join('\n');
      cleanHtml = cleanHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '<script src="script.js"></script>');
    }

    // Create zip file content
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    zip.file('index.html', cleanHtml);
    if (css) zip.file('styles.css', css);
    if (js) zip.file('script.js', js);
    
    // Add README with instructions
    const readme = `# Website Files

## How to Use:
1. Extract this ZIP file to a folder
2. Open the folder in VS Code
3. Open index.html in a web browser to view your website
4. Edit the HTML, CSS, and JavaScript files as needed

## Files:
- index.html: Main HTML structure
- styles.css: Styling (if applicable)
- script.js: JavaScript functionality (if applicable)

## Image Placeholders:
Replace any placeholder images with your own images by updating the src attributes in the HTML file.
`;
    
    zip.file('README.md', readme);
    
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToNewWebsite = () => {
    setGeneratedWebsite(null);
    setDescription('');
    setUpdateMode(false);
    setUpdatePrompt('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
            Transform your ideas into fully functional web applications instantly. 
            Simply describe what you need and watch sophisticated websites come to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Examples Section */}
            {!generatedWebsite && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-yellow-400" />
                      Try These Ideas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {examples.map((example, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setDescription(example)}
                          className="p-3 text-left bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-600 text-gray-200 text-sm transition-all duration-200"
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">
                      {updateMode ? 'Update Website' : generatedWebsite ? 'Current Website' : 'Describe Your Website'}
                    </h2>
                    {generatedWebsite && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setUpdateMode(!updateMode)}
                          variant="outline"
                          className="border-gray-600 text-gray-200 hover:bg-gray-800"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {updateMode ? 'Cancel Update' : 'Update Website'}
                        </Button>
                        <Button
                          onClick={resetToNewWebsite}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Website
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {updateMode ? (
                    <>
                      <Textarea
                        value={updatePrompt}
                        onChange={(e) => setUpdatePrompt(e.target.value)}
                        placeholder="Describe what changes you want to make to the current website..."
                        className="min-h-24 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none mb-4"
                      />
                      <Button
                        onClick={handleUpdate}
                        disabled={loading || !updatePrompt.trim()}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 text-lg"
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
                            Updating...
                          </>
                        ) : (
                          <>
                            <Edit className="mr-2 h-5 w-5" />
                            Update Website
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="I need a voice-controlled shopping list that works with screen readers..."
                        className="min-h-32 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none"
                        disabled={!!generatedWebsite}
                      />
                      {!generatedWebsite && (
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
                              Generate Website
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  )}
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
                  <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          <Globe className="h-6 w-6 text-green-400" />
                          Your Website
                        </h3>
                        <Button
                          onClick={() => downloadZip(generatedWebsite.html, `website_${generatedWebsite.id}`)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download ZIP
                        </Button>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <iframe
                          title="Generated Website"
                          srcDoc={generatedWebsite.html}
                          className="w-full h-96 border-0 rounded"
                        />
                      </div>
                      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                        <p className="text-sm text-gray-300 mb-2">
                          <strong>📦 Download Instructions:</strong>
                        </p>
                        <p className="text-sm text-gray-400">
                          You will receive a ZIP file containing HTML, CSS, and JavaScript files. 
                          Extract the ZIP file and open the folder in VS Code for easy editing and updates.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
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

          {/* Sidebar - History */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
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
                          className="p-3 bg-gray-800/30 rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-700/30 transition-colors"
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
                                downloadZip(website.html, `website_${website.id}`);
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
