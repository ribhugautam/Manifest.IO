import React, { useState } from 'react';


const Footer = () => {
  // Define an array of thoughts
  const thoughts = [
    'The only way to do great work is to love what you do. - Steve Jobs',
    'Believe you can and you\'re halfway there. - Theodore Roosevelt',
    'Don\'t watch the clock; do what it does. Keep going. - Sam Levenson',
    'The harder you work, the luckier you get. - Gary Player',
    'Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer',
    'If you can dream it, you can achieve it. - Zig Ziglar',
    'You miss 100% of the shots you don\'t take. - Wayne Gretzky',
    'The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt',
    'The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt',
    'Success is stumbling from failure to failure with no loss of enthusiasm. - Winston Churchill',
  ].filter(thought => thought !== null && thought !== undefined); // Check for null pointer references
  if (thoughts.length === 0) { // Check for unhandled exceptions
    throw Error('No thoughts available');
  }

  // Select a random thought from the array
  const [thought, setThought] = useState(thoughts[Math.floor(Math.random() * thoughts.length)]);

  // Update the thought every day at midnight
  React.useEffect(() => {
    const interval = setInterval(() => {
      setThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
    }, 86400000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="logo">
            <img src="logo.png" alt="Manifest.io" />
          </div>
          <div className="social-media">
            <a href="https://twitter.com/manifestio" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter" />
            </a>
            <a href="https://www.linkedin.com/company/manifestio/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in" />
            </a>
            <a href="https://github.com/manifestio" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github" />
            </a>
          </div>
          <div className="copyright">
            &copy; {new Date().getFullYear()} Manifest.io. All rights reserved.
          </div>
          <div className="thought">
            <p>"{thought}"</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;