import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Presentation } from "@/lib/types";
import { ChatInterface } from "./ChatInterface";
import { PresentationPreview } from "./PresentationPreview";
import { geminiService } from "@/lib/gemini-service";
import { useToast } from "@/hooks/use-toast";
import { SlideEditor } from "./SlideEditor";

export function AppBuilder() {
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'midnight' | 'skywave' | 'mint' | 'sunset' | 'ocean' | 'forest' | 'royal'>('light');
  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const { toast } = useToast();

  const generateFallbackPresentation = (topic: string, slideCount: number): Presentation => {
    const presentationTopic = topic && topic.trim() !== "" ? topic : "India: A Cultural and Historical Journey";
    
    const slides = [];
    const topics = [
      "Introduction to India", 
      "Rich Cultural Heritage", 
      "Historical Timeline", 
      "Geographical Diversity", 
      "Economic Growth", 
      "Indian Cuisine", 
      "Art and Architecture", 
      "Modern India", 
      "Global Influence", 
      "Future Prospects"
    ];
    
    for (let i = 0; i < slideCount; i++) {
      slides.push({
        title: i < topics.length ? `${topics[i]}` : `Aspect of India ${i + 1}`,
        content: [
          `${presentationTopic} point 1`,
          `${presentationTopic} point 2`,
          `${presentationTopic} point 3`,
        ],
        imagePrompt: `Image related to ${presentationTopic} - ${topics[i % topics.length]}`,
        imageUrl: `https://placehold.co/600x400/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=India+${i+1}`
      });
    }
    
    return {
      title: `Presentation on ${presentationTopic}`,
      slides,
      theme: selectedTheme
    };
  };

  const handleGeneratePresentation = async (prompt: string, slideCount: number) => {
    try {
      setLoading(true);
      
      if (!prompt || prompt.trim() === "") {
        toast({
          title: "Missing Topic",
          description: "Please provide a topic for your presentation.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      let newPresentation;
      
      try {
        newPresentation = await geminiService.generatePresentation(prompt, slideCount);
        
        console.log("Generating images for slides...");
        const imagePromises = newPresentation.slides.map(async (slide, index) => {
          if (slide.imagePrompt) {
            try {
              const imageUrl = await geminiService.generateImage(slide.imagePrompt);
              return { ...slide, imageUrl };
            } catch (error) {
              console.error(`Failed to generate image for slide ${index + 1}:`, error);
              return slide;
            }
          }
          return slide;
        });
        
        const updatedSlides = await Promise.all(imagePromises);
        
        newPresentation = {
          ...newPresentation,
          slides: updatedSlides,
          theme: selectedTheme
        };
        
      } catch (apiError) {
        console.error("API Generation failed:", apiError);
        toast({
          title: "Generation Failed",
          description: "Failed to generate presentation content. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      setPresentation(newPresentation);
      toast({
        title: "Presentation Generated",
        description: "Your presentation is ready! You can now edit individual slides or download the PPT."
      });
    } catch (error) {
      console.error("Failed to generate presentation:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate your presentation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSlideModification = async (slideIndex: number, modification: string) => {
    if (!presentation) return;
    
    try {
      const modifiedSlide = await geminiService.modifySlide(slideIndex, modification, presentation);
      
      if (modifiedSlide.imagePrompt) {
        const newImageUrl = await geminiService.generateImage(modifiedSlide.imagePrompt);
        modifiedSlide.imageUrl = newImageUrl;
      }
      
      const updatedSlides = [...presentation.slides];
      updatedSlides[slideIndex] = modifiedSlide;
      
      setPresentation({
        ...presentation,
        slides: updatedSlides
      });
      
      setEditingSlide(null);
      
      toast({
        title: "Slide Updated",
        description: `Slide ${slideIndex + 1} has been successfully modified.`
      });
    } catch (error) {
      console.error("Failed to modify slide:", error);
      toast({
        title: "Modification Failed",
        description: "Failed to modify the slide. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'midnight' | 'skywave' | 'mint' | 'sunset' | 'ocean' | 'forest' | 'royal') => {
    setSelectedTheme(theme);
    
    if (presentation) {
      setPresentation({
        ...presentation,
        theme
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-64px)] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          className="h-full border-r overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <ChatInterface 
            onSubmit={handleGeneratePresentation}
            loading={loading}
            onThemeChange={handleThemeChange}
            currentTheme={selectedTheme}
            presentation={presentation}
            onEditSlide={setEditingSlide}
            onSlideModification={handleSlideModification}
            editingSlide={editingSlide}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div 
          className="h-full overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5 }}
        >
          <PresentationPreview 
            presentation={presentation}
            loading={loading}
            onEditSlide={setEditingSlide}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
