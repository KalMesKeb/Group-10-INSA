import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import l3 from '../assets/l3.png';


const Header = ({ navigate, onLoginClick, loggedInUser, onLogout }) => {

  
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="absolute top-0 left-0 w-full z-20 p-6 lg:p-8" >
      <nav className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
         
           
          <img src={l3} alt="My Photo" className="w-20 h-20 object-cover" />
        </div>

        {/* Desktop Navigation links */}
        <div className="hidden lg:flex items-center space-x-8">
             <button
          onClick={() => navigate('home')}
          className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
        >
          Home
        </button>
            <button
          onClick={() => navigate('tutor-register')}
          className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
        >
          Become a Tutor
        </button>
          
          <button
          onClick={() => navigate('student-dashboard')} // Will lead to search tutors
          className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
        >
          Find a Tutor
        </button>

        <button
          onClick={() => navigate('dispute')} // Will lead to search tutors
          className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
        >
          Report
        </button>

        <button
          onClick={() => navigate('about')} // Will lead to search tutors
          className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
        >
          About Us
        </button>

        <button
          onClick={() => navigate('contact')} // Will lead to search tutors
          className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
        >
          Contact
        </button>

          <button
          onClick={() => navigate('login')}
          className=" cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300">
            SignUp
          </button>
      
      
    <button
      onClick={() => navigate('admin-dashboard')}
      className="hover:text-indigo-600 transition-colors text-lg font-medium"
    >
      Admin Dashboard
     </button>
          



        </div>
        
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full text-white space-y-8">
          
          <button
          onClick={() => navigate('tutor-register')} 
          className="text-white hover:text-gray-300 transition-colors duration-200"
        >
          Home
        </button>
            <button
          onClick={() => navigate('home')}
          className="text-white hover:text-gray-300 transition-colors duration-200"
        >
          Become a Tutor
        </button>
          
          <button
          onClick={() => navigate('student-dashboard')} // Will lead to search tutors
          className="text-white hover:text-gray-300 transition-colors duration-200"
        >
          Find a Tutor
        </button>
        <button
          onClick={() => navigate('student-dashboard')} // Will lead to search tutors
          className="text-white hover:text-gray-300 transition-colors duration-200"
        >
          About Us
        </button>

        <button
          onClick={() => navigate('student-dashboard')} // Will lead to search tutors
          className="text-white hover:text-gray-300 transition-colors duration-200"
        >
          Contact
        </button>

          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300">
            SignUp
          </button>

          
        </div>
      </div>
    </header>
  );
};

export default Header;