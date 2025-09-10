import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const analyzeCharacters = async (bookText) => {
  try {
   
    const apiKey = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY;

 
    const maxTextLength = 10000; 
    let truncatedText;
    
    if (bookText.length > maxTextLength) {
      const chunkSize = Math.floor(maxTextLength / 3);
      const start = bookText.substring(0, chunkSize);
      const middle = bookText.substring(
        Math.floor(bookText.length / 2) - Math.floor(chunkSize / 2),
        Math.floor(bookText.length / 2) + Math.floor(chunkSize / 2)
      );
      const end = bookText.substring(bookText.length - chunkSize);
      truncatedText = `${start}\n\n[... middle section ...]\n\n${middle}\n\n[... end section ...]\n\n${end}`;
    } else {
      truncatedText = bookText;
    }

    const prompt = `Analyze this book text and identify the main characters and their interactions.

Text: ${truncatedText}

Please return ONLY a JSON response in this exact format:
{
  "characters": [
    {
      "name": "Character Name",
      "mentions": 25,
      "description": "Brief description of the character"
    }
  ],
  "interactions": [
    {
      "character1": "Character A",
      "character2": "Character B", 
      "strength": 15,
      "description": "Nature of their relationship"
    }
  ]
}

IMPORTANT: Include ALL significant relationships between characters:
- Family relationships (parent-child, siblings, relatives)
- Romantic relationships (lovers, spouses, betrothed)
- Social relationships (friends, enemies, rivals)
- Professional relationships (mentor-student, employer-employee)
- Any characters who speak to each other or are mentioned together

Focus on the most important characters (limit to 8-12) and ensure you capture their key relationships. Count mentions and estimate interaction strength based on how often they interact or are mentioned together.`;


    const response = await axios.post(
      GROQ_API_URL,
      {
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.1-8b-instant", 
        temperature: 0.3,
        max_tokens: 2500, 
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = response.data.choices[0].message.content;
    
    console.log('Raw AI response:', result);

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return analysis;
    } else {
      throw new Error('LLM returned invalid format');
    }
    
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your Groq API key in the .env file.');
    }
    
    if (error.response?.status === 400) {
      const errorDetails = error.response?.data?.error?.message || 'Bad request';
      throw new Error(`Groq API request failed: ${errorDetails}. Check console for details.`);
    }
    
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    }
    
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};