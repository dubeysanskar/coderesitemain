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
      You are a world-class AI assistant for creating professional presentations, similar to tools like Gamma.ai.
      Your task is to generate a comprehensive and visually engaging presentation on the topic: "${topic}".

      The presentation must have exactly ${slideCount} slides.

      **Presentation Structure:**
      1.  **Title Slide (1 slide):** A compelling main title for the presentation and a shorter, engaging title for the slide itself.
      2.  **Agenda/Overview Slide (1 slide):** Outline the main sections of the presentation.
      3.  **Content Slides (${slideCount > 3 ? slideCount - 3 : 1} slides):**
          -   Each slide should cover a specific sub-topic.
          -   Use a clear, descriptive title (max 8 words).
          -   Provide 3-5 concise, impactful bullet points per slide (max 15 words each).
          -   The content should be well-researched, accurate, and flow logically.
      4.  **Conclusion/Summary Slide (1 slide):** Summarize the key takeaways.

      **For each slide, you MUST provide:**
      -   **title:** A string for the slide title.
      -   **content:** An array of strings, where each string is a bullet point.
      -   **imagePrompt:** A highly detailed and descriptive prompt for an AI image generator. The prompt should describe a professional, relevant, and aesthetically pleasing image (e.g., "A photorealistic image of a futuristic cityscape at sunset, with flying vehicles and holographic billboards, in a cinematic style."). This is crucial for generating visuals.

      **Output Format (Strict JSON):**
      Your entire output must be a single, valid JSON object. Do not include any text, explanations, or markdown formatting outside of the JSON structure.

      Example JSON structure:
      {
        "title": "Main Presentation Title",
        "slides": [
          {
            "title": "Title of Slide 1",
            "content": [
              "Bullet point 1.",
              "Bullet point 2.",
              "Bullet point 3."
            ],
            "imagePrompt": "Detailed prompt for an image for slide 1."
          }
        ]
      }
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
