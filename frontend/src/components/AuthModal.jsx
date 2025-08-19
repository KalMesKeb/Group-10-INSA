import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import fi1 from '../assets/fi1.jpeg';

const AuthModal = ({ onAuthSuccess, onClose }) => {
  const [currentForm, setCurrentForm] = useState('login');
  const [currentRole, setCurrentRole] = useState(null);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const RoleSelection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center space-y-6 text-center"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
        Welcome to Ethio-Tutors!
      </h2>
      <p className="text-gray-500 mb-6 max-w-sm">Select your role to continue your educational journey</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
        <motion.button
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          onClick={() => setCurrentRole('student')}
          className="w-full flex flex-col items-center justify-center py-4 px-4 border border-blue-100 text-lg font-bold text-blue-600 bg-white rounded-xl shadow-sm hover:bg-blue-50 transition-all duration-300"
        >
          <div className="w-12 h-12 mb-3 bg-blue-100 rounded-full flex items-center justify-center">
            {/* <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg> */}
          </div>
          Student
        </motion.button>
        <motion.button
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          onClick={() => setCurrentRole('tutor')}
          className="w-full flex flex-col items-center justify-center py-4 px-4 border border-green-100 text-lg font-bold text-green-600 bg-white rounded-xl shadow-sm hover:bg-green-50 transition-all duration-300"
        >
          <div className="w-12 h-12 mb-3 bg-green-100 rounded-full flex items-center justify-center">
            {/* <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg> */}
          </div>
          Tutor
        </motion.button>

        <motion.button
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          onClick={() => setCurrentRole('admin')}
          className="w-full flex flex-col items-center justify-center py-4 px-4 border border-red-100 text-lg font-bold text-red-600 bg-white rounded-xl shadow-sm hover:bg-red-50 transition-all duration-300"
        >
          <div className="w-12 h-12 mb-3 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          {/* Admin */}
        </motion.button> 
      </div>
    </motion.div>  
  );

  const LoginForm = ({ role }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for form data and loading
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle input changes
    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    // Handle login form submission
    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
          onAuthSuccess({ 
            role: data.user.role,
            user: data.user
          });
        } else {
          setError(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleLogin} className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {role === 'admin' ? 'Admin Login' : (role === 'student' ? 'Student Login' : 'Tutor Login')}
        </h2>
        <p className="text-gray-500 mb-6">Please log in to your account.</p>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            id="login-email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
            placeholder="you@example.com" 
            required 
          />
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="login-email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="you@example.com" 
              required 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
              <button 
                type="button"
                onClick={() => setCurrentForm('forgotPassword')} 
                className="text-sm text-green-600 hover:text-green-500 transition duration-150"
              >
                Forgot Password?
              </button>
            </div>
            <input 
              type="password" 
              id="login-password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="********" 
              required 
            />
          </div>
          <input 
            type="password" 
            id="login-password" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
            placeholder="********" 
            required 
          />
        </div>
        <div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white ${buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Logging in...' : `Login as ${buttonText}`}
          </button>
        </div>
        {role !== 'admin' && (
          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have an account?</span>
            <button 
              type="button"
              onClick={() => setCurrentForm('signup')} 
              className="font-medium text-green-600 hover:text-green-500 ml-1 transition duration-150"
            >
              Sign Up
            </button>   
          </div>
        )}
        <div className="text-center text-sm">
          <button 
            type="button"
            onClick={() => setCurrentRole(null)} 
            className="font-medium text-gray-600 hover:text-gray-800 transition duration-150"
          >
            ← Change Role
          </button>
        </div>
      </form>
    );
  };

  const StudentSignupForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      gradeLevel: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: 'student',
            gradeLevel: formData.gradeLevel
          })
        });

        const data = await response.json();

        if (data.success) {
          setRegisteredEmail(formData.email);
          setCurrentForm('verify');
        } else {
          setError(data.message || 'Registration failed');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Sign Up</h2>
        <p className="text-gray-500 mb-6">Join us to start learning!</p>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="student-signup-name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            type="text" 
            id="student-signup-name" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" 
            placeholder="John Doe" 
            required 
          />
        </div>
        <div>
          <label htmlFor="student-signup-email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            id="student-signup-email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" 
            placeholder="you@example.com" 
            required 
          />
        </div>
        <div>
          <label htmlFor="student-signup-password" className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            id="student-signup-password" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" 
            placeholder="********" 
            required 
          />
        </div>
        <div>
          <label htmlFor="student-signup-grade" className="block text-sm font-medium text-gray-700">Grade Level</label>
          <input 
            type="text" 
            id="student-signup-grade" 
            name="gradeLevel"
            value={formData.gradeLevel}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" 
            placeholder="e.g., 10th Grade" 
          />
        </div>
        <div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 disabled:opacity-50"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up as Student'}
          </button>
        </div>
        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>
          <a href="#" onClick={() => setCurrentForm('login')} className="font-medium text-blue-600 hover:text-blue-500 ml-1 transition duration-150">Login</a>
        </div>
        <div className="text-center text-sm">
          <a href="#" onClick={() => setCurrentRole(null)} className="font-medium text-gray-600 hover:text-gray-800 ml-1 transition duration-150">Change Role</a>
        </div>
      </form>
    );
  };

  // A component for Tutor Signup. It includes a specific field for subjects.
  const TutorSignupForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      subjects: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: 'tutor',
            subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s)
          })
        });

        const data = await response.json();

        if (data.success) {
          setRegisteredEmail(formData.email);
          setCurrentForm('verify');
        } else {
          setError(data.message || 'Registration failed');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Tutor Sign Up</h2>
        <p className="text-gray-500 mb-6">Join us to share your knowledge!</p>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="tutor-signup-name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input 
            type="text" 
            id="tutor-signup-name" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" 
            placeholder="John Doe" 
            required 
          />
        </div>
        <div>
          <label htmlFor="tutor-signup-email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            id="tutor-signup-email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" 
            placeholder="you@example.com" 
            required 
          />
        </div>
        <div>
          <label htmlFor="tutor-signup-password" className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            id="tutor-signup-password" 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" 
            placeholder="********" 
            required 
          />
        </div>
        <div>
          <label htmlFor="tutor-signup-subjects" className="block text-sm font-medium text-gray-700">Subjects you teach</label>
          <input 
            type="text" 
            id="tutor-signup-subjects" 
            name="subjects"
            value={formData.subjects}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" 
            placeholder="Math, Physics, Chemistry" 
            required 
          />
        </div>
        <div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 disabled:opacity-50"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up as Tutor'}
          </button>
        </div>
        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>
          <a href="#" onClick={() => setCurrentForm('login')} className="font-medium text-blue-600 hover:text-blue-500 ml-1 transition duration-150">Login</a>
        </div>
        <div className="text-center text-sm">
          <a href="#" onClick={() => setCurrentRole(null)} className="font-medium text-gray-600 hover:text-gray-800 ml-1 transition duration-150">Change Role</a>
        </div>
      </form>
    );
  };

  // Email verification form
  const EmailVerificationForm = () => {
    const [formData, setFormData] = useState({
      email: registeredEmail,
      code: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            code: formData.code
          })
        });

        const data = await response.json();

        if (data.success) {
          // Call onAuthSuccess to set the logged-in user state and navigate
          onAuthSuccess(data.user);
        } else {
          setError(data.message || 'Verification failed');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
          <p className="font-medium">Verification code sent</p>
          <p className="text-sm">We've sent a 6-digit code to <strong>{registeredEmail}</strong></p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="verify-code" className="block text-sm font-medium text-gray-700">Verification Code</label>
          <input 
            type="text" 
            id="verify-code" 
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-center text-2xl font-bold letter-spacing-wide" 
            placeholder="123456" 
            maxLength="6"
            required 
          />
        </div>
        <div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </div>
        <div className="text-center text-sm">
          <a href="#" onClick={() => setCurrentForm('login')} className="font-medium text-blue-600 hover:text-blue-500 ml-1 transition duration-150">Back to Login</a>
        </div>
      </form>
    );
  };

    return (
      <motion.form 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Sign Up</h2>
          <p className="text-gray-500 mb-6">Join our learning community today</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="student-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              id="student-name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="John Doe" 
              required 
            />
          </div>

          <div>
            <label htmlFor="student-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="student-email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="you@example.com" 
              required 
            />
          </div>

          <div>
            <label htmlFor="student-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              id="student-password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="********" 
              required 
            />
          </div>

          <div>
            <label htmlFor="student-grade" className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
            <input 
              type="text" 
              id="student-grade" 
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="e.g., 10th Grade" 
            />
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm text-lg font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Sign Up as Student'
            )}
          </button>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>
          <button 
            type="button"
            onClick={() => setCurrentForm('login')} 
            className="font-medium text-green-600 hover:text-green-500 ml-1 transition duration-150"
          >
            Login
          </button>
        </div>

        <div className="text-center text-sm">
          <button 
            type="button"
            onClick={() => setCurrentRole(null)} 
            className="font-medium text-gray-600 hover:text-gray-800 transition duration-150"
          >
            ← Change Role
          </button>
        </div>
      </motion.form>
    );
  };

  const TutorSignupForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      subjects: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onAuthSuccess({ role: 'tutor' });
      setIsSubmitting(false);
    };

    return (
      <motion.form 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Tutor Sign Up</h2>
          <p className="text-gray-500 mb-6">Share your knowledge with students</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="tutor-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              id="tutor-name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="John Doe" 
              required 
            />
          </div>

          <div>
            <label htmlFor="tutor-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="tutor-email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="you@example.com" 
              required 
            />
          </div>

          <div>
            <label htmlFor="tutor-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              id="tutor-password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="********" 
              required 
            />
          </div>

          <div>
            <label htmlFor="tutor-subjects" className="block text-sm font-medium text-gray-700 mb-1">Subjects You Teach</label>
            <input 
              type="text" 
              id="tutor-subjects" 
              value={formData.subjects}
              onChange={(e) => setFormData({...formData, subjects: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              placeholder="e.g., Math, Science" 
            />
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm text-lg font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Sign Up as Tutor'
            )}
          </button>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>
          <button 
            type="button"
            onClick={() => setCurrentForm('login')} 
            className="font-medium text-green-600 hover:text-green-500 ml-1 transition duration-150"
          >
            Login
          </button>
        </div>

        <div className="text-center text-sm">
          <button 
            type="button"
            onClick={() => setCurrentRole(null)} 
            className="font-medium text-gray-600 hover:text-gray-800 transition duration-150"
          >
            ← Change Role
          </button>
        </div>
      </motion.form>
    );
  };

  const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Password reset link sent to your email!');
      setCurrentForm('login');
      setIsSubmitting(false);
    };

    return (
      <motion.form 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
          <p className="text-gray-500 mb-6">We'll send you a link to reset your password</p>
        </div>

        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            id="forgot-email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="you@example.com" 
            required 
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-sm text-lg font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </div>

        <div className="text-center text-sm">
          <button 
            type="button"
            onClick={() => setCurrentForm('login')} 
            className="font-medium text-green-600 hover:text-green-500 transition duration-150"
          >
            ← Back to Login
          </button>
        </div>
      </motion.form>
    );
  };

  const renderForm = () => {
    if (!currentRole) return <RoleSelection />;

    switch (currentForm) {
      case 'signup':
        return currentRole === 'student' ? <StudentSignupForm /> : <TutorSignupForm />;
      case 'verify':
        return <EmailVerificationForm />;
      case 'forgotPassword':
        return <ForgotPasswordForm />;
      case 'login':
      default:
        return <LoginForm role={currentRole} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row w-full h-full">
          {/* Left Side: Image with Gradient Overlay */}
          <div className="relative w-full md:w-1/2 h-64 md:h-auto">
            <img
              src={fi1}
              alt="Students learning together"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 opacity-70"></div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
              <h2 className="text-3xl font-bold mb-4">Ethio-Tutors</h2>
              <p className="text-green-100">Connecting students with expert tutors for a better learning experience</p>
            </div>
          </div>

          {/* Right Side: Forms Container */}
          <div className="w-full md:w-1/2 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {renderForm()}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

export default AuthModal;