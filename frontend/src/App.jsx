// src/App.jsx
import React, { useState } from 'react';

import HomePage from './components/HomePage';


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); 

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleAuthSuccess = (user) => {
    setLoggedInUser(user);
    setIsAuthModalOpen(false);
   
    if (user.role === 'tutor') {
      navigate('tutor-profile'); 
    } else {
      navigate('student-dashboard');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    navigate('home');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white-100">
      
    
      <main className="flex-grow container mx-auto p-4">
        {currentPage === 'home' && <HomePage navigate={navigate} />}
        
    
      </main>
     

     
    </div>
  );
}

export default App;