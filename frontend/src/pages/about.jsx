import React from 'react';
import a3 from '../assete/a3.jpeg';

// The About Us page component, styled to match the provided landing page image.
const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center mt-20">
      {/* Main container with rounded corners and shadow */}
      <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-12 space-y-12">
        
        {/* Top Header Section - Split into text and image */}
        <header className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
          {/* Text content on the left */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
              Connect with expert tutors
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Welcome to Ethio-Tutors, a leading platform dedicated to connecting students with experienced and passionate tutors. Our mission is to make quality education accessible and affordable for everyone.
            </p>
           
          </div>
          
          {/* Illustration on the right */}
          <div className="flex-1 mt-8 md:mt-0">
            <img
              src={a3}
              alt="An illustration of diverse students and tutors"
              className="w-full h-auto rounded-3xl shadow-xl"
            />
          </div>
        </header>

        {/* Bottom Cards Section - Three cards for key features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Card 1: Find a tutor */}
          <div className="bg-orange-100 rounded-2xl p-6 shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 mb-4">
              <svg className="w-full h-full text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Find a tutor</h3>
            <p className="text-sm text-gray-600">
              Easily search and filter through our extensive database of tutors to find the perfect match for your learning needs.
            </p>
          </div>

          {/* Card 2: Learn anywhere */}
          <div className="bg-cyan-100 rounded-2xl p-6 shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 mb-4">
              <svg className="w-full h-full text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 01-9-9 9 9 0 019-9h.01m-.01 9h.01M20.25 10a8.25 8.25 0 10-16.5 0"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Learn anywhere</h3>
            <p className="text-sm text-gray-600">
              Connect with tutors online from the comfort of your home, making learning flexible and convenient.
            </p>
          </div>

          {/* Card 3: Affordable education */}
          <div className="bg-purple-100 rounded-2xl p-6 shadow-md flex flex-col items-center text-center">
            <div className="w-12 h-12 mb-4">
              <svg className="w-full h-full text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zM15 12h-3v-3m.5-8.5c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Affordable education</h3>
            <p className="text-sm text-gray-600">
              Browse tutors with competitive pricing and find high-quality educational support that fits your budget.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;
