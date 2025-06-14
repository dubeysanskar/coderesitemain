
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CX = import.meta.env.VITE_GOOGLE_CX;

export const fetchImageFromGoogle = async (query: string): Promise<string | null> => {
  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    console.log("Google API credentials missing");
    return null;
  }

  try {
    // Extract just the CX ID if it's a full URL
    const cxId = GOOGLE_CX.includes('cx=') ? GOOGLE_CX.split('cx=')[1] : GOOGLE_CX;
    
    // Clean up the query for better search results
    const cleanQuery = query
      .replace(/[^\w\s]/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${cxId}&searchType=image&q=${encodeURIComponent(cleanQuery)}&safe=active&num=10&imgSize=large&imgType=photo&fileType=jpg,png`;
    
    console.log("Searching Google for:", cleanQuery);
    console.log("Search URL:", searchUrl);
    
    const res = await fetch(searchUrl);
    const data = await res.json();
    
    console.log("Google Search Response:", data);
    
    if (data.items && data.items.length > 0) {
      // Return the first high-quality image result
      const imageUrl = data.items[0].link;
      console.log("Google Search image found:", imageUrl);
      return imageUrl;
    }
    
    console.log("No Google Search results found");
    return null;
  } catch (e) {
    console.error("Google Custom Search Image fetch failed:", e);
    return null;
  }
};

// Generate image using AI (placeholder for actual AI image generation)
export const generateAIImage = async (prompt: string): Promise<string | null> => {
  try {
    console.log("Attempting AI image generation for:", prompt);
    
    // For now, return a high-quality stock image URL based on the prompt
    // This can be replaced with actual AI image generation API
    const keywords = prompt.toLowerCase().split(' ').slice(0, 3).join('-');
    const stockImageUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(keywords)}`;
    
    console.log("Generated AI image URL:", stockImageUrl);
    return stockImageUrl;
  } catch (error) {
    console.error("AI Image generation failed:", error);
    return null;
  }
};
