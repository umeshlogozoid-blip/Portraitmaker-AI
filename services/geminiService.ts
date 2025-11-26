import { GoogleGenAI } from "@google/genai";
import { PortraitOptions } from "../types";

const API_KEY = process.env.API_KEY || '';

export const generatePortrait = async (
  imageBase64: string,
  options: PortraitOptions
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Construct color prompt instructions
  let colorInstructions = "Color: Pure Black (#000000) only.";
  if (options.useColor && options.colors && options.colors.length === 3) {
    colorInstructions = `
      Color Palette: Use strictly the following 3 colors for the vector shapes: ${options.colors.join(', ')}.
      - You MAY also use Black (#000000) for deepest shadows or outlines if needed for contrast.
      - Do NOT use gradients. Use solid flat colors (Pop Art / Poster style).
    `;
  }

  // Construct the prompt based on user options
  const prompt = `
    You are PortraitMaker AI.
    Task: Convert the attached photo into a professional vector-style stencil portrait.
    
    Style Requirements:
    - Line Style: ${options.lineStyle}
    - Contrast: ${options.contrastLevel}
    - Detail: ${options.detailLevel}
    - Aesthetics: Bold shapes, clean white space. High contrast. Sharp edges.
    - ${colorInstructions}
    - Format: Stencil / Vector art style suitable for T-shirt printing or stickers.
    - Background: Pure white (hex #FFFFFF). Do not include any background scenery.
    - Subject: Focus on the head and upper shoulders. Keep facial features accurate and recognizable but stylized.
    
    Output Instructions:
    - Do not add any text, signatures, or logos.
    - Do not distort the face.
    - Return ONLY the generated image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity
              data: imageBase64,
            },
          },
        ],
      },
    });

    // Extract the image from the response
    let generatedImageBase64 = null;

    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            generatedImageBase64 = part.inlineData.data;
            break; // Found the image
          }
        }
      }
    }

    if (!generatedImageBase64) {
      throw new Error("No image was generated. The model might have returned text instead.");
    }

    return generatedImageBase64;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate portrait.");
  }
};