import React from 'react';
import { motion } from 'framer-motion';
import a3 from '../assets/a1.jpeg';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8 flex flex-col items-center pt-20 mt-25">
      {/* Main container with rounded corners and shadow */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-12 space-y-12 border border-green-100"
      >
        {/* Top Header Section - Split into text and image */}
        <header className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
          {/* Text content on the left */}
          <div className="flex-1 text-center md:text-left">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            >
              Connect with expert tutors
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 leading-relaxed mb-6"
            >
              Welcome to Ethio-Tutors, a leading platform dedicated to connecting students with experienced and passionate tutors. Our mission is to make quality education accessible and affordable for everyone.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden md:block"
            >
              <div className="inline-flex rounded-md shadow">
                <a
                  onClick={() => handleNavigate('tutor-list')}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                >
                  Meet Our Tutors
                </a>
                
              </div>
            </motion.div>
          </div>
          
          {/* Illustration on the right */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 mt-8 md:mt-0"
          >
            <img
              src={a3}
              alt="An illustration of diverse students and tutors"
              className="w-full h-auto rounded-3xl shadow-xl border-4 border-white transform transition-all hover:scale-[1.02]"
            />
          </motion.div>
        </header>

        {/* Mission Statement Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-10 border border-green-200"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe every student deserves access to quality education. By connecting learners with passionate educators, we're building a community where knowledge is shared, skills are developed, and potential is unlocked.
            </p>
          </div>
        </motion.section>

        {/* Bottom Cards Section - Three cards for key features */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          {/* Card 1: Find a tutor */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 shadow-lg border border-green-100 flex flex-col items-center text-center hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Find a tutor</h3>
            <p className="text-sm text-gray-600">
              Easily search and filter through our extensive database of tutors to find the perfect match for your learning needs.
            </p>
          </motion.div>

          {/* Card 2: Learn anywhere */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 shadow-lg border border-emerald-100 flex flex-col items-center text-center hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Learn anywhere</h3>
            <p className="text-sm text-gray-600">
              Connect with tutors online from the comfort of your home, making learning flexible and convenient.
            </p>
          </motion.div>

          {/* Card 3: Affordable education */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-6 shadow-lg border border-teal-100 flex flex-col items-center text-center hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 mb-4 bg-teal-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Affordable education</h3>
            <p className="text-sm text-gray-600">
              Browse tutors with competitive pricing and find high-quality educational support that fits your budget.
            </p>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-90">Qualified Tutors</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-sm opacity-90">Students Helped</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-sm opacity-90">Subjects Covered</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-90">Support Available</div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to start learning?</h3>
          <div className="inline-flex rounded-md shadow">
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-md text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
            >
              Browse All Tutors
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutUs;