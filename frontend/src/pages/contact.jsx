import React, { useState, useEffect } from 'react';

// Main component for the Contact Page
const ContactPage = () => {
  // State to track if the form has been submitted
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Use useEffect to add CSS for animations and effects
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      
      body {
        font-family: 'Inter', sans-serif;
      }
      
      /* Keyframe animation for the form container fade-in effect */
      .form-container-fade-in {
        animation: fadeIn 1s ease-out forwards;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* New animation for the heading's wavy effect */
      .wavy-heading span {
        display: inline-block;
        animation: wave 2s ease-in-out infinite;
      }
      
      @keyframes wave {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }

      /* Delay for each letter to create the wave effect */
      .wavy-heading span:nth-child(1) { animation-delay: 0s; }
      .wavy-heading span:nth-child(2) { animation-delay: 0.1s; }
      .wavy-heading span:nth-child(3) { animation-delay: 0.2s; }
      .wavy-heading span:nth-child(4) { animation-delay: 0.3s; }
      .wavy-heading span:nth-child(5) { animation-delay: 0.4s; }
      .wavy-heading span:nth-child(6) { animation-delay: 0.5s; }
      .wavy-heading span:nth-child(7) { animation-delay: 0.6s; }
      .wavy-heading span:nth-child(8) { animation-delay: 0.7s; }
      .wavy-heading span:nth-child(9) { animation-delay: 0.8s; }
      .wavy-heading span:nth-child(10) { animation-delay: 0.9s; }
      .wavy-heading span:nth-child(11) { animation-delay: 1.0s; }
      .wavy-heading span:nth-child(12) { animation-delay: 1.1s; }
      .wavy-heading span:nth-child(13) { animation-delay: 1.2s; }
      .wavy-heading span:nth-child(14) { animation-delay: 1.3s; }
      
      /* New animation for the thank you message */
      .animated-thank-you {
        display: inline-block;
        animation: rotateAndColor 5s linear infinite;
      }

      @keyframes rotateAndColor {
        0% { transform: rotate(0deg); color: #ef4444; } /* Red */
        25% { transform: rotate(2deg); color: #f97316; } /* Orange */
        50% { transform: rotate(0deg); color: #10b981; } /* Emerald */
        75% { transform: rotate(-2deg); color: #3b82f6; } /* Blue */
        100% { transform: rotate(0deg); color: #ef4444; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      // Clean up the style tag when the component unmounts
      document.head.removeChild(style);
    };
  }, []);

  // Split the heading text into an array of letters to apply the animation
  const headingText = "Get in Touch";
  const animatedHeading = headingText.split('').map((char, index) => (
    <span key={index}>{char === ' ' ? '\u00A0' : char}</span>
  ));

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate an API call or form submission logic here
    console.log("Form submitted!");
    setIsSubmitted(true);
  };

  // Render the thank you message if the form is submitted
  if (isSubmitted) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 max-w-2xl w-full text-center form-container-fade-in">
          <h2 className="text-4xl font-bold mb-4 animated-thank-you">Thank You!</h2>
          <h2 className="text-4xl font-bold mb-4 animated-thank-you">Successfully Submitted</h2>
          <p className="text-gray-600 text-lg">
            Ethio-Tutors Thank you for Your comment. We will contact you as soon as possible.
          </p>
        </div>
      </div>
    );
  }

  // Render the contact form by default
  return (
    <div className="min-h-screen  flex items-center justify-center p-4 mt-20">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 max-w-3xl w-full form-container-fade-in">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-4 wavy-heading">
          {animatedHeading}
        </h1>
        <p className="text-gray-600 text-center mb-8">We'd love to hear from you! Please fill out the form below.</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Two-column layout for name and email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="contact-name" className="mt-1 block w-full px-4 py-3 bg-gray-50 rounded-lg shadow-inner focus:ring-indigo-500 focus:ring-2 transition-all duration-300 ease-in-out text-gray-900 focus:scale-105" placeholder="John Doe" required />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="contact-email" className="mt-1 block w-full px-4 py-3 bg-gray-50 rounded-lg shadow-inner focus:ring-indigo-500 focus:ring-2 transition-all duration-300 ease-in-out text-gray-900 focus:scale-105" placeholder="you@example.com" required />
            </div>
          </div>

          {/* Message field */}
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea id="contact-message" rows="5" className="mt-1 block w-full px-4 py-3 bg-gray-50 rounded-lg shadow-inner focus:ring-indigo-500 focus:ring-2 transition-all duration-300 ease-in-out text-gray-900 focus:scale-105" placeholder="Your message..." required></textarea>
          </div>

          {/* Submit button */}
          <div>
            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-blue-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:scale-105">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
