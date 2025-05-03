import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white mt-auto shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="flex space-x-4">
            <a 
              href="https://x.com/yantology" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-pink-200 transition-colors duration-300 font-medium"
            >
              X (Twitter)
            </a>
            <a 
              href="https://www.linkedin.com/in/muhamad-wijayanto/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-pink-200 transition-colors duration-300 font-medium"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/yantology/magic-card" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-pink-200 transition-colors duration-300 font-medium"
            >
              GitHub
            </a>
          </div>          <div className="text-pink-100 mx-4 hidden md:block">|</div>
          <div>
            <a 
              href="mailto:work@yantology.com"
              className="hover:text-pink-200 transition-colors duration-300 font-medium"
            >
              work@yantology.com
            </a>
          </div>
        </div>
        <div className="text-center mt-4 text-pink-100 text-sm backdrop-blur-sm">
          © {new Date().getFullYear()} Muhamad Wijayanto
        </div>
      </div>
    </footer>
  );
};

export default Footer;
