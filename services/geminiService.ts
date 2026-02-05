
import { GoogleGenAI } from "@google/genai";

// Use directly process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessInsights = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a business analyst for KHM SALES, analyze this sales and inventory data and provide 3 key insights for profit optimization: ${JSON.stringify(data)}`,
      config: {
        systemInstruction: "You are a senior business data analyst. Provide concise, actionable insights based on retail sales data.",
      },
    });
    // Accessing .text property directly
    return response.text;
  } catch (error) {
    console.error("AI Insights Error:", error);
    return "Could not generate insights at this time.";
  }
};
