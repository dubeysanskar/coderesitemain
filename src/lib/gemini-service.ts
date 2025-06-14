import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Presentation, SlideContent } from './types';

// This service will handle interactions with the Gemini API
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    // Use the API key from environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Initialize the Gemini 1.5 Flash model
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  }

  // Helper function to extract JSON from potential markdown code blocks
  private extractJsonFromResponse(text: string): string {
    // Check if the response is wrapped in markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return jsonMatch[1].trim();
    }
    
    // If no markdown code blocks are found, return the original text
    return text;
  }

  async generatePresentation(topic: string, slideCount: number): Promise<Presentation> {
    const systemPrompt = `
      You are an advanced AI presentation builder like Gamma.ai.
      Your task is to generate a thoroughly structured, visually engaging, professional presentation about "${topic}" with exactly ${slideCount} slides.

      -- STRUCTURE REQUIREMENTS --
      - SLIDE 1: Title slide. "title": Main full deck title; "subtitle": A creative subtitle for this topic.
      - SLIDE 2: Agenda/Overview. "title": Agenda; "content": bullet points listing ALL slide titles/topics.
      - SLIDES 3-${slideCount-1}: Content slides, each on a different subtopic. For every slide:
        * "title": Clear, concise, <8 words, relevant to the subtopic.
        * "content": 3-5 information-rich bullet points (max 20 words each), each uniquely explaining a key aspect of this subtopic — avoid repeating explanations or listing too-simple facts.
        * "imagePrompt": Extremely specific image prompt, themed DIRECTLY after this slide's content.
      - FINAL SLIDE: Conclusion/Summary. Recap main learnings and takeaways.

      -- IMAGE GENERATION --
      For every slide except the agenda/overview, create the "imagePrompt" as a vivid, DETAILED prompt that reflects the main SUBJECT and CONTEXT of the slide; always specify the style (photo, illustration, graph, etc). The prompt must stay on-topic and fit a 16:9 aspect for a presentation slide.

      -- CONTENT GUIDELINES --
      - Each slide’s bullet points should clearly explain new information, not just list, but summarize AND provide a key explanation or fact.
      - Output structure must be:
        {
          "title": [deck title],
          "slides": [
            {
              "title": "[slide title]",
              "subtitle": "[subtitle text]" (use only on first slide, else omit),
              "content": ["point 1", "point 2", ...],
              "imagePrompt": "[detailed image prompt for this slide]"
            }, ...
          ]
        }
      - If a slide does not need imagePrompt (such as agenda), set imagePrompt: "".

      -- OUTPUT RULES --
      Output ONLY strictly valid JSON matching the structure above. NO extra text, code blocks, or markdown — just the JSON object.
    `;

    try {
      console.log(`Generating presentation on "${topic}" with ${slideCount} slides...`);
      const result = await this.model.generateContent([systemPrompt]);
      const rawText = await result.response.text();
      console.log("Raw Gemini response:", rawText.substring(0, 200) + "..."); // Log part of the response for debugging
      
      // Clean the response to extract JSON
      const cleanedText = this.extractJsonFromResponse(rawText);
      console.log("Cleaned JSON:", cleanedText.substring(0, 200) + "..."); // Log part of the cleaned response
      
      // Try to parse the cleaned response as JSON
      try {
        const data = JSON.parse(cleanedText);
        
        // Basic validation that we got what we expected
        if (!data.title || !Array.isArray(data.slides)) {
          console.error("Invalid response format - missing title or slides array:", data);
          throw new Error('Invalid response format from Gemini');
        }
        
        // Map the response to our Presentation format
        return {
          title: data.title,
          slides: data.slides.map((slide: any) => ({
            title: slide.title,
            content: Array.isArray(slide.content) ? slide.content.slice(0, 6) : [], // Limit to max 6 bullet points
            imagePrompt: slide.imagePrompt || `High quality professional presentation image about ${slide.title} related to ${topic} with clear visual elements, suitable for 16:9 slide format`,
          })),
          theme: 'light', // Default theme
        };
      } catch (e) {
        console.error('Failed to parse Gemini response:', e);
        console.error('Problematic JSON text:', cleanedText);
        throw new Error('Failed to parse presentation data from AI');
      }
    } catch (e) {
      console.error('Gemini API error:', e);
      throw new Error('Failed to generate presentation content');
    }
  }

  async generateImage(prompt: string): Promise<string> {
    // A list of high-quality, professional placeholder images from Unsplash
    const placeholderImages = [
      'photo-1488590528505-98d2b5aba04b', // code on laptop
      'photo-1518770660439-4636190af475', // circuit board
      'photo-1461749280684-dccba630e2f6', // code on monitor
      'photo-1486312338219-ce68d2c6f44d', // person using macbook
      'photo-1485827404703-89b55fcc595e', // robot
      'photo-1531297484001-80022131f5a1', // laptop on surface
      'photo-1487058792275-0ad4aaf24ca7', // colorful code
      'photo-1519389950473-47ba0277781c', // team working on laptops
      'photo-1498050108023-c5249f4df085', // macbook with code
      'photo-1605810230434-7631ac76ec81'  // people looking at screens
    ];
    
    // Pick a random image from the list
    const randomImageId = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    
    // In a real application, this would call an actual image generation API using the prompt.
    // For now, we return a high-quality, correctly-sized placeholder.
    console.log(`Using placeholder image for prompt: "${prompt}"`);
    return `https://images.unsplash.com/${randomImageId}?w=1600&h=900&fit=crop`;
  }
}

export const geminiService = new GeminiService();
