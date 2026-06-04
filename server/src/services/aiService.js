const { GoogleGenerativeAI } = require('@google/generative-ai');

// initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define our two models: Premium and Fallback
const primaryModel = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
const fallbackModel = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// Helper function to handle the fallback logic cleanly
const executeWithFallback = async (prompt) => {
  try {
    // 1. Try the premium model first
    console.log("Attempting AI generation with primary model...");
    const result = await primaryModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    // 2. If it fails (quota, rate limit, etc.), log it and switch models
    console.warn("Primary model failed or quota exceeded. Switching to fallback...", error.message);
    
    try {
      const fallbackResult = await fallbackModel.generateContent(prompt);
      return fallbackResult.response.text();
    } catch (fallbackError) {
      // 3. If both fail, we have a real problem
      console.error("Critical Failure: Both AI models refused the request.", fallbackError);
      throw new Error("AI generation currently unavailable.");
    }
  }
};

// @desc    Takes note text and asks Gemini to summarize it
exports.summarizeText = async (text) => {
  const prompt = `Summarize the following private note. 
  Guidelines:
  - Keep it short (exactly 3-5 bullet points).
  - Base the summary ONLY on the note content provided. Do not add outside info.
  
  Note Content:
  "${text}"`;

  // We use our resilient fallback function here
  return await executeWithFallback(prompt);
};

// @desc    Takes a topic from the user and drafts a short note
exports.draftNoteWithAI = async (topic) => {
  const prompt = `Write a short, casual private note about the following topic: "${topic}".
  Guidelines:
  - The total length MUST be under 400 characters to fit our database limits.
  - Write it directly, no conversational filler like "Here is your note:".`;

  // And we use it here
  return await executeWithFallback(prompt);
};