
const GOOGLE_API_KEY = import.meta.env.GOOGLE_API_KEY;
const GOOGLE_CX = import.meta.env.GOOGLE_CX;

export const fetchImageFromGoogle = async (query: string): Promise<string | null> => {
  if (!GOOGLE_API_KEY || !GOOGLE_CX) return null;

  try {
    // Clean up the query a bit for best results
    const cleanQuery = query.replace(/[^\w\s]/gi, '').replace(/\s{2,}/g, ' ');
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&searchType=image&q=${encodeURIComponent(
        cleanQuery
      )}&safe=active&num=3`
    );
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      // Return the first image result
      return data.items[0].link as string;
    }
    return null;
  } catch (e) {
    console.error("Google Custom Search Image fetch failed: ", e);
    return null;
  }
};
