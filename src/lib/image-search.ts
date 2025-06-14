
const GOOGLE_API_KEY = import.meta.env.GOOGLE_API_KEY;
const GOOGLE_CX = import.meta.env.GOOGLE_CX;

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
    
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${cxId}&searchType=image&q=${encodeURIComponent(cleanQuery)}&safe=active&num=5&imgSize=large&imgType=photo`;
    
    console.log("Searching Google for:", cleanQuery);
    const res = await fetch(searchUrl);
    const data = await res.json();
    
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
