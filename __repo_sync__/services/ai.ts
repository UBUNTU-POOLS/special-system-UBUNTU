
import { GoogleGenAI } from "@google/genai";
import { TrustScore } from "../types";

export interface AiResponse {
  text: string;
  sources: { title: string; url: string }[];
}

/**
 * Safely extracts grounding URLs from the model response.
 */
const extractSources = (response: any) => {
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  const chunks = groundingMetadata?.groundingChunks || [];
  
  const sources = chunks
    .filter((chunk: any) => chunk.web && chunk.web.uri)
    .map((chunk: any) => ({
      title: chunk.web.title || "Reference",
      url: chunk.web.uri
    }));
    
  // Filter unique URLs to avoid duplicates in the UI
  return Array.from(new Map(sources.map((s: any) => [s.url, s])).values()) as { title: string; url: string }[];
};

/**
 * A robust wrapper for Gemini calls that handles 500 errors with retries 
 * and falls back to a non-grounded search if the search tool causes failures.
 */
async function generateGeminiContentWithFallback(params: {
  model: string;
  prompt: string;
  systemInstruction: string;
  useSearch?: boolean;
}): Promise<AiResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const maxRetries = 1;

  const attemptCall = async (withSearch: boolean) => {
    return await ai.models.generateContent({
      model: params.model,
      contents: params.prompt,
      config: {
        systemInstruction: params.systemInstruction,
        tools: withSearch ? [{ googleSearch: {} }] : undefined,
      },
    });
  };

  try {
    // Initial attempt with search (if requested)
    let response;
    try {
      response = await attemptCall(params.useSearch ?? false);
    } catch (e: any) {
      // If 500, retry once
      if (e.message?.includes('500') || e.status === 500) {
        await new Promise(r => setTimeout(r, 1000));
        response = await attemptCall(params.useSearch ?? false);
      } else {
        throw e;
      }
    }

    return {
      text: response.text || "No response generated.",
      sources: extractSources(response)
    };
  } catch (error: any) {
    console.warn("Gemini Primary Call Failed:", error);

    // If search was the likely culprit of a 500, try one last time without it
    if (params.useSearch && (error.message?.includes('500') || error.status === 500)) {
      try {
        const fallbackResponse = await attemptCall(false);
        return {
          text: fallbackResponse.text || "Fallback response generated.",
          sources: []
        };
      } catch (fallbackError) {
        console.error("Gemini Fallback Call Failed:", fallbackError);
      }
    }
    
    throw error;
  }
}

export const getUbuntuWisdom = async (score: TrustScore, name: string): Promise<AiResponse> => {
  try {
    return await generateGeminiContentWithFallback({
      model: 'gemini-3-flash-preview',
      systemInstruction: `You are an Ubuntu Community Advisor. Analyze the member's Trust DNA and provide a short (2 sentence) encouragement and risk tip. 
      Contextualize your answer with the current South African economic climate (ZAR performance, inflation, or interest rates).
      Tone: Humanistic, professional but warm.`,
      prompt: `Member Name: ${name}
      Ubuntu Score: ${score.score}
      Performance Metrics: Velocity: ${score.metrics.contributionVelocity}, Vouching: ${score.metrics.communityVouching}.`,
      useSearch: true
    });
  } catch (error) {
    return { 
      text: "Your commitment is our shared strength. In times of fluctuation, the collective remains our most stable asset. Keep the fire burning.", 
      sources: [] 
    };
  }
};

export const generateMediationAdvice = async (memberName: string, daysLate: number, amount: number): Promise<AiResponse> => {
  try {
    return await generateGeminiContentWithFallback({
      model: 'gemini-3-pro-preview',
      systemInstruction: `You are an Ubuntu Mediator. Draft a "Nudge of Restoration" that is firm but compassionate. 
      Reference the philosophy that "a person is a person through others" and suggest a payment plan or a call for community support if they are facing hardship.
      Tone: Respectful, community-focused, firm but empathetic. Avoid aggressive legal jargon.`,
      prompt: `Member: ${memberName}
      Days Overdue: ${daysLate}
      Contribution Amount: R ${amount}`,
      useSearch: true
    });
  } catch (error) {
    return { text: "We noticed your contribution is delayed. Remember that the strength of the circle depends on the reliability of each link. Please reach out if you need support.", sources: [] };
  }
};

export const generateWholesaleProposal = async (poolName: string, totalValue: number, memberCount: number, partner: string): Promise<AiResponse> => {
  try {
    return await generateGeminiContentWithFallback({
      model: 'gemini-3-pro-preview',
      systemInstruction: `You are a Strategic Partnership Architect. Draft a professional 'Wholesale Bulk-Buying Strategic Partnership Proposal'. 
      Advocate for deep discounts based on the collective buying power of a verified community circle.`,
      prompt: `Lead Pool: ${poolName}
      Target Partner: ${partner}
      Aggregated Buying Power: R ${totalValue.toLocaleString()}
      Participating Businesses: ${memberCount}
      Terms: Request a 12-18% discount. Suggest 2% platform commission.`,
      useSearch: true
    });
  } catch (error) {
    return { text: "Unable to generate professional proposal at this time. Please try again or draft manually.", sources: [] };
  }
};
