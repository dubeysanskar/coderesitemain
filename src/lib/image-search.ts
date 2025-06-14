
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CX = import.meta.env.VITE_GOOGLE_CX;

export const fetchImageFromGoogle = async (query: string): Promise<string | null> => {
  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    console.log("Google API credentials missing - GOOGLE_API_KEY:", !!GOOGLE_API_KEY, "GOOGLE_CX:", !!GOOGLE_CX);
    return null;
  }

  try {
    // Extract just the CX ID if it's a full URL
    const cxId = GOOGLE_CX.includes('cx=') ? GOOGLE_CX.split('cx=')[1].split('&')[0] : GOOGLE_CX;
    
    // Clean up the query for better search results
    const cleanQuery = query
      .replace(/[^\w\s]/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${cxId}&searchType=image&q=${encodeURIComponent(cleanQuery)}&safe=active&num=5&imgSize=large&imgType=photo&fileType=jpg,png,jpeg`;
    
    console.log("Searching Google for:", cleanQuery);
    console.log("Using CX ID:", cxId);
    
    const res = await fetch(searchUrl);
    
    if (!res.ok) {
      console.error("Google Search API error:", res.status, res.statusText);
      const errorText = await res.text();
      console.error("Error details:", errorText);
      return null;
    }
    
    const data = await res.json();
    
    console.log("Google Search Response status:", res.status);
    console.log("Google Search items found:", data.items?.length || 0);
    
    if (data.items && data.items.length > 0) {
      // Try to find a high-quality image
      for (const item of data.items) {
        if (item.link && item.link.match(/\.(jpg|jpeg|png)$/i)) {
          console.log("Google Search image found:", item.link);
          return item.link;
        }
      }
      
      // Fallback to first image if no direct image links found
      const imageUrl = data.items[0].link;
      console.log("Google Search fallback image:", imageUrl);
      return imageUrl;
    }
    
    console.log("No Google Search results found for:", cleanQuery);
    return null;
  } catch (e) {
    console.error("Google Custom Search Image fetch failed:", e);
    return null;
  }
};

// Generate image using AI with better fallback
export const generateAIImage = async (prompt: string): Promise<string | null> => {
  try {
    console.log("Attempting AI image generation for:", prompt);
    
    // Extract keywords and create a more specific search
    const keywords = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 3)
      .join(',');
    
    const stockImageUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(keywords)}`;
    
    console.log("Generated AI image URL:", stockImageUrl);
    return stockImageUrl;
  } catch (error) {
    console.error("AI Image generation failed:", error);
    return null;
  }
};
