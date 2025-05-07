import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY, // Use environment variable for security
  dangerouslyAllowBrowser: true
});

export const checkQualification = async (resume: string, jobDescription: string): Promise<string> => {

  
  
  try {

    const callOpenRouter = async () => {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",  // Replace with your actual API key
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // or another supported model
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: `Here is a resume and a job description. Please tell me if the person is qualified with a brief summary. The resume is: ${resume} and the job description is: ${jobDescription}`}
          ]
        })
      });
    
      const data = await response.json();
      return data.choices?.[0]?.message?.content;
    };
    
    var ret = await callOpenRouter();
    return ret;

  
  } catch (error) {
    console.error('Error connecting to AI service:', error);
    return 'There was an error processing your request. Please try again later.';
  }
};
