
import { GoogleGenAI } from "@google/genai";
import { TripPreferences, TravelItinerary } from "../types";

const API_KEY = process.env.API_KEY || "";

export const generateTripPlan = async (prefs: TripPreferences): Promise<TravelItinerary> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Act as a world-class travel planning expert. Create a highly detailed travel itinerary for a trip to: ${prefs.destination}.
    
    User Preferences:
    - Duration: ${prefs.duration}
    - Budget Level: ${prefs.budget}
    - Group Size: ${prefs.groupSize}
    - Interests: ${prefs.interests.join(', ')}
    - Travel Style: ${prefs.travelStyle}
    - Additional Details: ${prefs.otherDetails}

    CRITICAL INSTRUCTIONS:
    1. ALL currency mentions must be in Nepali Rupees (NPR). Use "Rs." prefix.
    2. Include essential logistical info: Required permits (especially for restricted areas like Upper Mustang), entry requirements, and the best seasons.
    3. Provide a logical daily flow (Day 1, Day 2, etc.) with specific activities.
    4. Provide exactly 3 structured accommodation recommendations that fit the specified budget.
    5. Be specific about transport options (flights, private jeeps, trekking routes).

    You MUST respond ONLY with a valid JSON object following this structure:
    {
      "overview": "string",
      "highlights": ["string"],
      "permitsAndLogistics": ["string"],
      "itinerary": [
        {
          "day": number,
          "title": "string",
          "activities": [
            {
              "time": "string",
              "description": "string",
              "location": "string",
              "type": "sightseeing" | "dining" | "activity" | "travel"
            }
          ]
        }
      ],
      "accommodations": [
        {
          "name": "string",
          "priceNPR": "string",
          "category": "string",
          "description": "string"
        }
      ]
    }

    Use Google Search grounding for real-time accuracy on current permit costs in Nepal and hotel prices.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" is OMITTED because it conflicts with googleSearch tool in Flash models
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Extract JSON from potential markdown blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;
    
    const parsed: TravelItinerary = JSON.parse(cleanJson);
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      parsed.groundingSources = groundingChunks
        .filter((c: any) => c.web)
        .map((c: any) => ({
          title: c.web.title,
          uri: c.web.uri
        }));
    }

    return parsed;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
