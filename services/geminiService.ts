import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from '../types';

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const getAIRecommendations = async (
  query: string,
  existingMovies: Movie[]
): Promise<Movie[]> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    // Fallback to random sorting if no API key
    return [...existingMovies].sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // We are asking for Creative Concepts or "Dream Movies" based on the user's input.
    // In a future iteration, we could use Tool Calling to search TMDB for real movies.
    
    const prompt = `
      The user is asking for movie recommendations with this query: "${query}".
      
      Generate 4 unique, exciting movie concepts that perfectly fit this mood. 
      These should look like real movie listings but can be creative interpretations of what the user wants.
      
      You must return a JSON array. Each object in the array must follow this structure:
      {
        "title": "Movie Title",
        "description": "A short, engaging plot summary (max 2 sentences).",
        "genre": ["Genre1", "Genre2"],
        "year": 2024,
        "rating": "PG-13",
        "duration": "1h 55m",
        "matchScore": 98
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              genre: { type: Type.ARRAY, items: { type: Type.STRING } },
              year: { type: Type.INTEGER },
              rating: { type: Type.STRING },
              duration: { type: Type.STRING },
              matchScore: { type: Type.INTEGER }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Map the AI response to our Movie interface, adding placeholder images
    return data.map((item: any, index: number) => ({
      ...item,
      id: `ai-gen-${Date.now()}-${index}`,
      thumbnailUrl: `https://picsum.photos/seed/${item.title.replace(/[^a-zA-Z]/g, '')}/400/600`,
      coverUrl: `https://picsum.photos/seed/${item.title.replace(/[^a-zA-Z]/g, '')}-wide/1920/1080`,
      trending: false
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};
