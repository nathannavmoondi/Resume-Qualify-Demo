

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
          model: "google/gemini-2.5-flash", // or another supported model
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: `Here is a resume and a job description. Please analyze and return ONLY the following HTML structure, formatted beautifully with icons and color:

<div>
  <h2>👤 [Candidate Name]</h2>
  <h3>[✅ Qualified / ❌ Not Qualified]</h3>
  <div><b>📝 Summary</b> [1-2 sentence summary of why or why not qualified]</div>
  <div><b>📋 Detailed Summary</b> [A detailed paragraph explaining why the candidate is or is not qualified, referencing specific strengths, experience, or gaps relevant to the job]</div>
  <div><b>✨ Highlights</b></div>
  <div>
    🌟 [Highlight 1]<br/>
    🌟 [Highlight 2]<br/>
    🌟 [Highlight 3]<br/>
    <!-- Add more as needed -->
  </div>
  <div><b>🔚 Conclusion</b> [1 sentence closing summary]</div>
</div>

Replace bracketed sections with real content. Do not include work experience, skills, or education sections. All icons and their section headlines (e.g., 📝 Summary) must be on the same line, not stacked. Do not center any text; all content should be left-aligned. Do not use bulletpoints or colons anywhere, use only the icons provided. Do not include html or body tags. The resume is: ${resume} and the job description is: ${jobDescription}`}
          ]
        })
      });
    
      const data = await response.json();
      let content = data.choices?.[0]?.message?.content ?? '';
      // Remove any ```html or ``` markers from the response
      content = content.replace(/```html|```/gi, '').trim();

      // Post-process: wrap standalone <b> or <span> tags in <p> for spacing
      // This will only wrap <b> or <span> that are not already inside a block element
      content = content.replace(/(<b[^>]*>.*?<\/b>)/gi, '<p>$1</p>');
      content = content.replace(/(<span[^>]*>.*?<\/span>)/gi, '<p>$1</p>');

      // Make candidate name (h2) bigger
      content = content.replace(/<h2([^>]*)>/i, '<h2$1 style="font-size:2.2em; margin-bottom:0.2em;">');

      return content;
    };
    
    var ret = await callOpenRouter();
    return ret;

  
  } catch (error) {
    console.error('Error connecting to AI service:', error);
    return 'There was an error processing your request. Please try again later.';
  }
};
