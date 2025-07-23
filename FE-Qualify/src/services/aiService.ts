

export const checkQualification = async (resume: string, jobDescription: string): Promise<string> => {
  
    try {

    const callOpenRouter = async () => {

      console.log('key', process.env.VITE_OPENAI_API_KEY);
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.VITE_OPENAI_API_KEY}`,  // Replace with your actual API key
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // or another supported model
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: `Here is a resume and a job description. 
              Please tell me if the person is qualified with a brief summary nothing more. 

              Format it nicely. Make it html friendly and do not include html or body tags.
              Use icons and emojis to make it visually appealing and colors.              
              For important items, use <b> tags or icons instead of ** or * for emphasis. Do not use ** for bolding.
              The resume is: ${resume} and the job description is: ${jobDescription}`}
          ]
        })
      });
    
      const data = await response.json();
      let content = data.choices?.[0]?.message?.content ?? '';
      // Remove any ```html or ``` markers from the response
      content = content.replace(/```html|```/gi, '').trim();
      return content;
    };
    
    var ret = await callOpenRouter();
    return ret;

  
  } catch (error) {
    console.error('Error connecting to AI service:', error);
    return 'There was an error processing your request. Please try again later.';
  }
};
