
import { GoogleGenAI } from "@google/genai";
import { PortraitOptions, ColorMode } from "../types";

const API_KEY = process.env.API_KEY || '';

export const generatePortrait = async (
  imageBase64: string,
  options: PortraitOptions
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Color logic
  let colorInstructions = "";
  if (options.colorMode === ColorMode.BW) {
    colorInstructions = "Color: Strictly Pure Black (#000000) on White (#FFFFFF). No other colors.";
  } else if (options.colorMode === ColorMode.TRIAD) {
    colorInstructions = `Color Palette: Use strictly these 3 colors: ${options.colors.join(', ')}. Use solid flat shapes (Posterized/Pop-art style).`;
  } else {
    colorInstructions = "Color: Full Vibrant Color. Use a rich, diverse palette while maintaining a clean vector/digital illustration style. Bold and saturation-rich.";
  }

  // Text logic
  let textInstructions = "";
  if (options.customText.trim()) {
    textInstructions = `
      - Text Integration: Include the text "${options.customText.trim()}" in the image.
      - Font Style: Use a ${options.fontStyle} aesthetic for the typography.
      - Placement: Position the text naturally, likely at the bottom center or integrated into the stencil composition.
      - Consistency: Ensure the text color matches the portrait's color scheme.
    `;
  }

  const prompt = `
    You are PortraitMaker AI, a professional digital portrait artist specializing in vector and stencil styles.
    
    Task: Convert the provided photo into a high-quality stylized portrait.
    
    Technical Requirements:
    - Art Style: Professional Vector/Stencil art. Sharp clean edges, bold shapes.
    - Line Weight: ${options.lineStyle}.
    - Contrast: ${options.contrastLevel}.
    - Complexity: ${options.detailLevel}.
    - ${colorInstructions}
    - Background: Solid Pure White (#FFFFFF). No background objects or scenery.
    - Subject: Head and shoulders portrait. Maintain the likeness and character of the person.
    ${textInstructions}
    
    Output Format:
    - Return ONLY the generated image. 
    - No photographic elements; the result must be clearly artistic/vectorized.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64,
            },
          },
        ],
      },
    });

    let generatedImageBase64 = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          generatedImageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!generatedImageBase64) {
      throw new Error("The AI did not generate an image. It might have responded with text instead due to content filters.");
    }

    return generatedImageBase64;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate portrait.");
  }
};
