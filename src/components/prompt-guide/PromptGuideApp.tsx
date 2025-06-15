
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Wand2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { refinePrompt } from '@/lib/prompt-refiner-service';

const PromptGuideApp = () => {
  const [rawInput, setRawInput] = useState('');
  const [targetModel, setTargetModel] = useState('gemini');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleRefinePrompt = async () => {
    if (!rawInput.trim()) {
      toast.error('Please enter some text to refine');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Starting prompt refinement...');
      console.log('Raw input:', rawInput);
      console.log('Target model:', targetModel);
      
      const refined = await refinePrompt(rawInput, targetModel);
      console.log('✅ Refined prompt received:', refined);
      
      setRefinedPrompt(refined);
      setShowComparison(true);
      toast.success('Prompt refined successfully!');
    } catch (error) {
      console.error('❌ Error refining prompt:', error);
      toast.error('Failed to refine prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadPrompt = () => {
    const blob = new Blob([refinedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'refined-prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Prompt downloaded!');
  };

  // Function to format text with proper markdown rendering
  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wand2 className="h-8 w-8 text-green-400" />
            <h1 className="text-4xl font-bold text-white">Prompt Guide</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your raw ideas into polished, structured prompts for any AI model
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm">1</span>
                Raw Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your raw idea or messy instructions here...

Example: 'i want to build a tool that take excel upload and send email with different names using brevo. it should have dynamic fields like name and message. should be automated.'"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="min-h-[200px] bg-gray-800/80 border-gray-600 text-white placeholder-gray-400"
              />
              
              <div className="space-y-3">
                <label className="text-sm text-gray-300">Available Models:</label>
                <Select value={targetModel} onValueChange={setTargetModel}>
                  <SelectTrigger className="bg-gray-800/80 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="gemini" className="text-white">Google Gemini 2.0 Flash (use it for now)</SelectItem>
                    <SelectItem value="chatgpt" className="text-white">OpenAI ChatGPT</SelectItem>
                    <SelectItem value="claude" className="text-white">Anthropic Claude</SelectItem>
                    <SelectItem value="general" className="text-white">General Purpose</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleRefinePrompt}
                disabled={isLoading || !rawInput.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Refining Prompt...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Refine Prompt
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm">2</span>
                Refined Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {refinedPrompt ? (
                <>
                  <div className="bg-gray-800/80 border border-gray-600 rounded-lg p-4 min-h-[200px]">
                    <div 
                      className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatText(refinedPrompt) }}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(refinedPrompt)}
                      variant="outline"
                      className="flex-1 border-gray-600 text-black bg-white hover:bg-white hover:text-black"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      onClick={downloadPrompt}
                      variant="outline"
                      className="flex-1 border-gray-600 text-black bg-white hover:bg-white hover:text-black"
                    >
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Your refined prompt will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Before & After Comparison */}
        {showComparison && rawInput && refinedPrompt && (
          <Card className="mt-8 bg-gray-900/80 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-green-400" />
                Before → After Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-3">BEFORE (Raw Input)</h4>
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">{rawInput}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-3">AFTER (Refined Prompt)</h4>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div 
                      className="text-gray-300 text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatText(refinedPrompt) }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <Card className="mt-8 bg-gray-900/80 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">💡 Tips for Better Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="text-white font-medium mb-2">Input Tips:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Be specific about your goal</li>
                  <li>• Mention input/output formats</li>
                  <li>• Include any constraints or requirements</li>
                  <li>• Don't worry about grammar or structure</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">What Gets Improved:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Clear role definition for the AI</li>
                  <li>• Structured task breakdown</li>
                  <li>• Specific input/output formats</li>
                  <li>• Professional language and clarity</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromptGuideApp;
