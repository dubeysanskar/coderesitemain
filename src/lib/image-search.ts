
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CX = import.meta.env.VITE_GOOGLE_CX;

export const fetchImageFromGoogle = async (query: string): Promise<string | null> => {
  if (!GOOGLE_API_KEY || !GOOGLE_CX) {
    console.log("Google API credentials missing - GOOGLE_API_KEY:", !!GOOGLE_API_KEY, "GOOGLE_CX:", !!GOOGLE_CX);
    return null;
  }

  try {
    // Extract just the CX ID if it's a full URL
    let cxId = GOOGLE_CX;
    if (cxId.includes('cx=')) {
      const parts = cxId.match(/cx=([a-zA-Z0-9]+)/);
      if (parts && parts[1]) cxId = parts[1];
      else cxId = cxId.split('cx=')[1]?.split('&')[0] || cxId;
    }
    
    // Clean up the query for better search results
    const cleanQuery = query
      .replace(/[^\w\s]/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${cxId}&searchType=image&q=${encodeURIComponent(cleanQuery)}&safe=active&num=5&imgSize=large&imgType=photo&fileType=jpg,png,jpeg`;
    
    console.log("[GoogleSearch] Searching for:", cleanQuery, "URL:", searchUrl);

    const res = await fetch(searchUrl);
    if (!res.ok) {
      const err = await res.text();
      console.error("[GoogleSearch] HTTP error:", res.status, res.statusText, err);
      return null;
    }

    const data = await res.json();
    // Log the raw items for debugging
    console.log("[GoogleSearch] items:", data.items);

    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        if (item.link && /\.(jpg|jpeg|png)$/i.test(item.link)) {
          console.log("[GoogleSearch] Selected image:", item.link);
          return item.link;
        }
      }
      // fallback: use the first result regardless of extension
      const imageUrl = data.items[0].link;
      console.log("[GoogleSearch] Fallback to first image:", imageUrl);
      return imageUrl;
    }
    console.log("[GoogleSearch] No results found for:", cleanQuery);
    return null;
  } catch (e) {
    console.error("[GoogleSearch] Exception:", e);
    return null;
  }
};

// Generate image using Unsplash as fallback, NO placeholder ever
export const generateAIImage = async (prompt: string): Promise<string | null> => {
  try {
    // Extract keywords and create a more specific search
    const keywords = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 3)
      .join(',');

    // Always try Unsplash as fallback, which returns a real relevant photo
    const stockImageUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(keywords)}`;
    console.log("[AIImage] Using Unsplash fallback URL:", stockImageUrl);

    // Optionally: Ping the Unsplash url and check it's a valid image; otherwise, just return the url
    return stockImageUrl;
  } catch (error) {
    console.error("[AIImage] Exception:", error);
    return null;
  }
};
