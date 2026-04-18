import { GoogleGenAI, Type } from "@google/genai";
import { AIPlanResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateProjectPlan(input: string, fileContent?: string): Promise<AIPlanResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are a professional project planner for college students.
    Based on the following project description, create a detailed project plan.
    
    Description: ${input}
    ${fileContent ? `Context from attached file: ${fileContent}` : ""}
    
    Return a JSON object with the following structure:
    {
      "title": "Project Title",
      "steps": [
        {
          "title": "Phase 1: ...",
          "description": "...",
          "suggestedRoles": ["Role 1", "Role 2"]
        }
      ],
      "timelineRecommendations": "..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  suggestedRoles: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "description", "suggestedRoles"]
              }
            },
            timelineRecommendations: { type: Type.STRING }
          },
          required: ["title", "steps", "timelineRecommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIPlanResult;
  } catch (error) {
    console.error("AI Planner Error:", error);
    throw error;
  }
}
