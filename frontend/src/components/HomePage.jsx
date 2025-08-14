// src/components/HomePage.jsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import myPhoto from '../assets/bg41.jpeg';


const HomePage = ({ navigate }) => {
const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, you would handle the search logic here
    console.log('Searching for:', searchQuery);
  };
  return (
    <section className="text-center  mx-auto py-16" >
        <img src={myPhoto} alt="My Photo"  className="absolute inset-0 bg-cover bg-center" />
      <h2 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
        Your Journey to Knowledge Starts Here 
      </h2>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
        Connect with qualified tutors for personalized learning, or share your expertise to help students succeed.
      </p>

        <section className="relative h-[100vh] flex items-center justify-center text-white">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        // style={{ backgroundImage: "url('/images/myphoto.jpg')" }}
      >
        
        {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}
      </div>

      <div className="relative z-10 text-center p-4 -mt-60">
        {/* Main heading */}
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-lg">
          Find Your Perfect Tutor
        </h1>
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Subjects or Keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white w-full py-3 px-5 pr-10 rounded-full text-gray-800 placeholder-gray-1000 shadow-md focus:outline-none focus:ring-2 focus:ring-black-500"
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button

            type="submit"
            className=" cursor-pointer bg-white text-emerald-600 hover:bg-emerald-200 text-green font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
          >
            Search
          </button>
        </form>

       
        <h2 className="text-3xl lg:text-4xl font-extrabold mt-12 mb-6 drop-shadow-lg">
          Unlock Your Potential with Personalized Tutoring
        </h2>
        {/* Call to action button */}
        <button  onClick={() => navigate('AuthModal')}
          className=" cursor-pointer bg-white-500 text-white-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300">
          Get Started
        </button>
      </div>
    </section>

      <div className="flex justify-center space-x-6" mx-auto>
        
        <button
          onClick={() => navigate('student-dashboard')} 
          className=" cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Find a Tutor
        </button>
        <button
          onClick={() => navigate('tutor-register')}
          className=" cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Become a Tutor
        </button>
      </div>
      <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="p-6 bg-blue-50 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold text-blue-700 mb-3">Personalized Learning</h3>
          <p className="text-gray-700">Get one-on-one attention tailored to your learning style and pace.</p>
        </div>
        <div className="p-6 bg-green-50 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold text-green-700 mb-3">Expert Tutors</h3>
          <p className="text-gray-700">Browse profiles of verified and highly-rated educators.</p>
        </div>
        <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold text-purple-700 mb-3">Flexible Scheduling</h3>
          <p className="text-gray-700">Book sessions at times that fit your busy schedule.</p>
        </div>
      </div>
    </section>
  );
};

export default HomePage;