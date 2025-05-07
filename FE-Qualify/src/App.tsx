import React, { useState } from 'react';
import './App.css';
import { checkQualification } from './services/aiService';
import { FaUserGraduate } from 'react-icons/fa';
import { POOR_RESUME_DESCRIPTION, GOOD_RESUME_DESCRIPTION, EXCELLENT_RESUME_DESCRIPTION, JOB_DESCRIPTION } from './constants/resumeTemplates';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>Developed (c) 2025 by Nathan Nav Moondi</p>
      <p>Built using React, TypeScript, Vercel and OpenAI</p>
    </footer>
  );
};

const App: React.FC = () => {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [response, setResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleQualify = async () => {
    if (!resume || !jobDescription) {
      setResponse('Please provide both a resume and a job description.');
      return;
    }

    setResponse('');
    setIsTyping(true);

    try {
      const aiResponse = await checkQualification(resume, jobDescription);
      let currentText = '';
      let index = 0;
      
      const typingInterval = setInterval(() => {
        if (index < aiResponse.length) {
          currentText += aiResponse[index];
          setResponse(currentText);
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          // Change button text to Done when processing is complete
          setTimeout(() => {
            const button = document.querySelector('.qualify-button') as HTMLButtonElement;
            if (button) {
              button.textContent = 'Done';
              // Reset back to Qualify after 2 seconds
              setTimeout(() => {
                if (button && !isTyping) {
                  button.textContent = 'Qualify';
                }
              }, 2000);
            }
          }, 100);
        }
      }, 6);
    } catch (error) {
      setResponse('There was an error processing your request. Please try again later!.');
      setIsTyping(false);
    }
  };

  const handlePoorResumeClick = () => {
    setJobDescription(JOB_DESCRIPTION);
    setResume(POOR_RESUME_DESCRIPTION);
    setResponse('');
  };

  const handleGoodResumeClick = () => {
    setJobDescription(JOB_DESCRIPTION);
    setResume(GOOD_RESUME_DESCRIPTION);
    setResponse('');
  };

  const handleExcellentResumeClick = () => {
    setJobDescription(JOB_DESCRIPTION);
    setResume(EXCELLENT_RESUME_DESCRIPTION);
    setResponse('');
  };

  return (
    <>
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">    
     
      <main className="main-content">
      <nav className="navbar">
        <h1 className="text-center text-1xl font-bold flex items-center justify-center">
          <FaUserGraduate className="mr-2" /> Resume Qualify
        </h1> 
      </nav>
        <h2>Check Resume Qualification</h2>
        <div className="flex justify-center gap-4 mt-4 sample-buttons-div">
          <button className="sample-button" onClick={handlePoorResumeClick}>Junior Developer</button>
          <button className="sample-button" onClick={handleGoodResumeClick}>Mid-Level Developer</button>
          <button className="sample-button" onClick={handleExcellentResumeClick}>Senior Developer</button>
        </div>
        <textarea
          className="textarea"
          placeholder="Paste your resume here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        ></textarea>
        <textarea
          className="textarea"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>
        <button className="qualify-button" onClick={handleQualify} disabled={isTyping}>
          {isTyping ? 'Processing...' : 'Qualify'}
        </button>
        {response && <div className="response-box">{response}</div>}
      </main>
    </div>
    <Footer />
    </>
  );
};

export default App;
