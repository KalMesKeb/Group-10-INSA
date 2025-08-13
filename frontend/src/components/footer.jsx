import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-8" >
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Ethio-Tutoring</p>
        <p className="mt-2">
          <a href="#" className="hover:underline mx-2">Privacy Policy</a> |
          <a href="#" className="hover:underline mx-2">Terms of Service</a> |
          <a href="#" className="hover:underline mx-2">Contact Us</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
