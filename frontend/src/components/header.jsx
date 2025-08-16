import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import l3 from '../assets/l3.png';


const Header = ({ navigate, onLoginClick, loggedInUser, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to close the mobile menu after a navigation action
  const handleNavigate = (page) => {
    navigate(page);
    setIsMobileMenuOpen(false);
  };

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
            onClick={() => handleNavigate('home')}
            className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
          >
            Home
          </button>

          {/* Public links visible to everyone */}
          <button
            onClick={() => handleNavigate('about')}
            className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
          >
            About Us
          </button>
          <button
            onClick={() => handleNavigate('contact')}
            className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
          >
            Contact
          </button>
          
          
          {/* Become a Tutor is for non-logged-in users or anyone to see */}
        
            
          

          {/* Student-specific links */}
          {loggedInUser?.role === 'student' && (
            <>
              <button
                onClick={() => handleNavigate('student-dashboard')}
                className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
              >
                Find a Tutor
              </button>

              
              <button
                onClick={() => handleNavigate('dispute')}
                className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
              >
                Report
              </button>
            </>
          )}

          {/* Admin-specific links */}
          {loggedInUser?.role === 'admin' && (
            <button
              onClick={() => handleNavigate('admin-dashboard')}
              className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
            >
              Admin Dashboard
            </button>
          )}

          {/* Tutor-specific link */}
          {loggedInUser?.role === 'tutor' && (

            <>
            <button
              onClick={() => handleNavigate('tutor-profile')}
              className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
            >
              My Profile
            </button>

              <button
              onClick={() => handleNavigate('tutor-register')}
              className=" cursor-pointer text-black hover:text-gray-300 transition-colors duration-200"
            >
              Become a Tutor
            </button>

            </>
            
          )}

          {/* Conditionally render login/signup or logout */}
          {loggedInUser ? (
            <button
              onClick={onLogout}
              className="cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300"
            >
              Sign Up / Log In
            </button>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-black">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden flex flex-col items-center justify-center space-y-8`}
      >
        <button
          onClick={() => handleNavigate('home')}
          className="text-black text-xl hover:text-gray-700 transition-colors duration-200"
        >
          Home
        </button>

       
          
       

        {loggedInUser?.role === 'student' && (
          <>
            
            <button
              onClick={() => handleNavigate('student-dashboard')}
              className="text-black text-xl hover:text-gray-700 transition-colors duration-200"
            >
              Find a Tutor
            </button>

            <button
              onClick={() => handleNavigate('dispute')}
              className="text-black text-xl hover:text-gray-700 transition-colors duration-200"
            >
              Report
            </button>
          </>
        )}
        
        {loggedInUser?.role === 'admin' && (
          <button
            onClick={() => handleNavigate('admin-dashboard')}
            className="text-black text-xl hover:text-gray-700 transition-colors duration-200"
          >
            Admin Dashboard
          </button>
        )}

        {loggedInUser?.role === 'tutor' && (

          <>
          <button
            onClick={() => handleNavigate('tutor-profile')}
            className="text-black text-xl hover:text-gray-700 transition-colors duration-200"
          >
            My Profile
          </button>
            <button
            onClick={() => handleNavigate('tutor-register')}
            className="text-black text-xl hover:text-gray-700 transition-colors duration-200"
          >
            Become a Tutor
          </button>


          </>
          



        )}

        <button
          onClick={() => handleNavigate('about')}
          className="text-black text-xl hover:text-gray-700 transition-colors duration-200"
        >
          About Us
        </button>

        <button
          onClick={() => handleNavigate('contact')}
          className="text-black text-xl hover:text-gray-700 transition-colors duration-200"
        >
          Contact
        </button>

        {loggedInUser ? (
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300"
          >
            
            Logout
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300"
          >
            Sign Up / Log In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
