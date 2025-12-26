
import { GoogleGenAI, Type } from "@google/genai";
import { Task, Priority, TaskStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTaskBreakdown = async (taskTitle: string, taskDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Break down this task into 3-5 manageable subtasks: "${taskTitle}" (${taskDescription}). Return only the list of subtasks.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
            },
            required: ["title"]
          }
        }
      }
    });
    
    const text = response.text;
    return JSON.parse(text || "[]");
  } catch (error) {
    console.error("Error fetching task breakdown:", error);
    return [];
  }
};

export const getProjectSummary = async (tasks: Task[]) => {
  const taskSummary = tasks.map(t => `- ${t.title} (${t.status}, Priority: ${t.priority})`).join('\n');
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As a project manager, summarize the status of these tasks and provide 3 key action items for the team:\n\n${taskSummary}`,
      config: {
        systemInstruction: "You are a professional project manager. Keep the summary concise and focused on risks and progress."
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching project summary:", error);
    return "Could not generate summary at this time.";
  }
};

export const generatePlanFromIdea = async (idea: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a professional project plan for the following idea: "${idea}". 
      Return a list of 6 tasks with priorities and estimated durations.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              status: { type: Type.STRING, enum: ["Todo"] },
              dueDate: { type: Type.STRING, description: "YYYY-MM-DD format, estimate roughly from today" }
            },
            required: ["title", "description", "priority", "status", "dueDate"]
          }
        }
      }
    });
    
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating project plan:", error);
    return [];
  }
};
