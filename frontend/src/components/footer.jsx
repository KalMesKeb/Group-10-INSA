import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const socialLinks = [
    { icon: <Facebook size={20} />, url: "#", label: "Facebook" },
    { icon: <Twitter size={20} />, url: "#", label: "Twitter" },
    { icon: <Instagram size={20} />, url: "#", label: "Instagram" },
    { icon: <Linkedin size={20} />, url: "#", label: "LinkedIn" }
  ];

  const quickLinks = [
    { name: "Home", url: "#" },
    { name: "Find Tutors", url: "#" },
    { name: "Become a Tutor", url: "#" },
    { name: "How It Works", url: "#" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", url: "#" },
    { name: "Terms of Service", url: "#" },
    { name: "Cookie Policy", url: "#" }
  ];

  const contactInfo = [
    { icon: <Mail size={18} />, text: "info@ethiotutoring.com" },
    { icon: <Phone size={18} />, text: "+251 123 456 789" },
    { icon: <MapPin size={18} />, text: "Addis Ababa, Ethiopia" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000); // Reset after 5 seconds
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <footer className="w-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        {/* Contact Form Section */}
        <div className="mb-16 p-8 bg-gray-700 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-6">Contact Us Directly</h3>
          
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="inline-block animate-bounce mb-4">
                <Send size={48} className="text-emerald-400" />
              </div>
              <h4 className="text-xl font-bold text-emerald-400 mb-2">Thank You!</h4>
              <p className="text-gray-300">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="footer-name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  id="footer-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition-all"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="footer-email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  id="footer-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="footer-message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                <textarea
                  id="footer-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition-all"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>
              <div className="md:col-span-2 text-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-lg transition-all transform hover:scale-105"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-emerald-400">Ethio-Tutoring</h3>
            <p className="text-gray-300">
              Connecting students with the best tutors in Ethiopia for personalized learning experiences.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url}
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url}
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Info</h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-emerald-400 mt-0.5">{item.icon}</span>
                  <span className="text-gray-300">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Ethio-Tutoring. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-300">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;