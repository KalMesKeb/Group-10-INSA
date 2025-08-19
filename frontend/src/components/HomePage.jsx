// src/components/HomePage.jsx
import React, { useState } from 'react';
import { ChevronDown, Star, Quote, GraduationCap, BookOpen, Clock, Users } from 'lucide-react';
import myPhoto from '../assets/bg41.jpeg';
import tutor1 from '../assets/tutor1.jpg';
import tutor2 from '../assets/tutor2.jpg';
import tutor3 from '../assets/tutor3.jpg';
import student1 from '../assets/student1.png';
import student2 from '../assets/student2.jpg';

const HomePage = ({ navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const tutors = [
    {
      id: 1,
      name: "Mthious Assefa",
      subject: "Mathematics",
      experience: "10 years",
      rating: 4.9,
      image: tutor1
    },
    {
      id: 2,
      name: "Robel Demeke",
      subject: "Computer Science",
      experience: "8 years",
      rating: 4.8,
      image: tutor2
    },
    {
      id: 3,
      name: "Tomas Dendire",
      subject: "English Literature",
      experience: "5 years",
      rating: 4.7,
      image: tutor3
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Shalom Dawit",
      role: "High School Student",
      content: "My math grades improved from C to A in just 3 months thanks to my tutor! The personalized approach made all the difference.",
      image: student1
    },
    {
      id: 2,
      name: "Martha Solomon",
      role: "College Student",
      content: "The flexibility to schedule sessions around my part-time job was a game-changer. I could finally keep up with my CS coursework.",
      image: student2
    }
  ];

  const stats = [
    { value: "95%", label: "Success Rate", icon: <GraduationCap size={32} /> },
    { value: "10,000+", label: "Lessons Taught", icon: <BookOpen size={32} /> },
    { value: "24/7", label: "Availability", icon: <Clock size={32} /> },
    { value: "500+", label: "Expert Tutors", icon: <Users size={32} /> }
  ];

  return (
    <div className="relative w-screen">
      {/* Hero Section */}
      <section className="relative w-screen h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 w-screen h-full overflow-hidden">
          <img 
            src={myPhoto} 
            alt="Students learning"  
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in">
            Find Your Perfect <span className="text-emerald-400">Tutor</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Personalized 1-on-1 tutoring sessions with verified experts in any subject
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search subjects, tutors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 px-6 pr-12 rounded-full text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
            </div>
            <button
              type="submit"
              className="cursor-pointer w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Find Tutors
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <button 
              onClick={() => navigate('tutor-list')}
              className="cursor-pointer flex items-center gap-2 bg-white text-emerald-600 hover:bg-emerald-50 font-semibold py-3 px-6 rounded-full shadow-md transition-all"
            >
              <Users size={20} /> Browse Tutors
            </button>
            <button
              onClick={() => navigate('tutor-register')}
              className="cursor-pointer flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all"
            >
              <GraduationCap size={20} /> Teach with Us
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="animate-bounce p-2 rounded-full bg-white bg-opacity-20">
            <ChevronDown size={32} className="text-white" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 w-screen">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-emerald-600 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tutors */}
      <section className="py-16 bg-white w-screen">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Meet Our Expert Tutors</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Highly qualified professionals ready to help you achieve your academic goals
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tutors.map(tutor => (
              <div key={tutor.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:-translate-y-2">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={tutor.image} 
                    alt={tutor.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{tutor.name}</h3>
                  <p className="text-gray-600 mb-2">{tutor.subject} • {tutor.experience} experience</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        className={`${i < Math.floor(tutor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="ml-2 text-gray-700">{tutor.rating}</span>
                  </div>
                  <button 
                    onClick={() => navigate('tutor-list')}
                    className="cursor-pointer mt-4 w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('tutor-list')}
              className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all"
            >
              Browse All Tutors
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 w-screen">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Students Say</h2>
          
          <div className="relative bg-white rounded-xl shadow-lg p-8 md:p-12">
            <Quote className="absolute top-6 left-6 text-gray-200" size={32} />
            
            <div className="text-center mb-8">
              <img 
                src={testimonials[activeTestimonial].image} 
                alt={testimonials[activeTestimonial].name} 
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-emerald-100"
              />
              <p className="text-xl italic text-gray-700 mb-4">
                "{testimonials[activeTestimonial].content}"
              </p>
              <h4 className="font-bold text-lg">{testimonials[activeTestimonial].name}</h4>
              <p className="text-gray-600">{testimonials[activeTestimonial].role}</p>
            </div>
            
            <div className="flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${activeTestimonial === index ? 'bg-emerald-600' : 'bg-gray-300'}`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-500 text-white w-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have achieved their academic goals with our tutors
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('AuthModal')}
              className="bg-white text-emerald-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition-all"
            >
              Find a Tutor
            </button>
            <button
              onClick={() => navigate('tutor-register')}
              className="bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-20 font-bold py-3 px-8 rounded-full shadow-lg transition-all"
            >
              Become a Tutor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;