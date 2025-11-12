import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const modifySlideContent = async (title: string, content: string, instruction: string): Promise<{ newTitle: string, newContent: string }> => {
  const model = 'gemini-2.5-pro';

  const schema = {
    type: Type.OBJECT,
    properties: {
      newTitle: {
        type: Type.STRING,
        description: 'The revised title for the slide. It can be the same as the original if no change is needed.'
      },
      newContent: {
        type: Type.STRING,
        description: 'The revised content for the slide, with bullet points separated by newlines.'
      }
    },
    required: ['newTitle', 'newContent']
  };

  const prompt = `You are an expert pitch deck copywriter. Your task is to modify the given slide title and content based on a specific instruction. Return the complete, revised slide, even if parts are unchanged.

  **Original Title:**
  ${title}

  **Original Content:**
  ${content}

  **Instruction:**
  "${instruction}"

  Now, provide the revised title and content in the required format.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    // A simple check to handle cases where the model might return markdown noise
    if (jsonText.startsWith('```json')) {
        return JSON.parse(jsonText.replace('```json\n', '').replace('\n```', ''));
    }
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error modifying slide content with Gemini:", error);
    throw new Error("Failed to get suggestions from the AI. Please try again.");
  }
};
