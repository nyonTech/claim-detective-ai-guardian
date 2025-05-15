
/**
 * Service for interacting with the LLaMA API
 */

// The base URL for the LLaMA API
const LLAMA_API_URL = 'https://api.perplexity.ai/chat/completions';

// Helper function to get API key from localStorage or prompt user if not available
const getLlamaApiKey = (): string => {
  const apiKey = localStorage.getItem('llama_api_key');
  if (!apiKey) {
    throw new Error('LLaMA API key not found. Please set your API key in the settings.');
  }
  return apiKey;
};

/**
 * Analyze text using the LLaMA API for fraud detection
 * @param text The text to analyze
 * @returns Analysis result with fraud detection information
 */
export const analyzeTextForFraud = async (text: string) => {
  try {
    const apiKey = getLlamaApiKey();
    
    const response = await fetch(LLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant specializing in healthcare insurance fraud detection. 
            Analyze the provided medical claim document for signs of fraud. 
            Look for inconsistencies in dates, inappropriate procedure codes, diagnosis mismatches, 
            unusual billing patterns, and other fraud indicators. 
            Provide a structured analysis with:
            1. A boolean fraud determination (true or false)
            2. A confidence score (0-100)
            3. Specific reasons that support your determination
            4. Recommended actions to take
            Format your response as a valid JSON object with keys: isFraud, confidenceScore, reasons (array), suggestedActions (array).`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the response content to extract the JSON
    let analysisResult;
    try {
      // The content might be nested in the response
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        // Try to parse the content if it's JSON
        analysisResult = JSON.parse(content);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (jsonError) {
      console.error("Error parsing LLaMA API response:", jsonError);
      throw new Error("Failed to parse analysis result");
    }
    
    return analysisResult;
  } catch (error) {
    console.error("Error analyzing text with LLaMA API:", error);
    throw error;
  }
};

/**
 * Chat with the LLaMA API about a claim document
 * @param message User message
 * @param claimContext Context about the claim
 * @returns LLaMA API response
 */
export const chatWithLlama = async (message: string, claimContext?: string) => {
  try {
    const apiKey = getLlamaApiKey();
    
    const systemContent = claimContext 
      ? `You are a helpful assistant for healthcare insurance claims. Use the following context about the claim: ${claimContext}`
      : 'You are a helpful assistant for healthcare insurance claims.';

    const response = await fetch(LLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: systemContent
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    return content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error chatting with LLaMA API:", error);
    throw error;
  }
};
