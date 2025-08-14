import React, { useState } from 'react';
import fi1 from '../assets/fi1.jpeg';


// The main App component handles the state and rendering of the forms.
const App = () => {
  // We'll manage the state for the current form ('login', 'signup', 'forgotPassword')
  // and the current role ('student', 'tutor', or null if not selected).
  const [currentForm, setCurrentForm] = useState('login');
  const [currentRole, setCurrentRole] = useState(null);

  // A component to render the role selection screen.
  const RoleSelection = () => (
    <div className="flex flex-col items-center justify-center space-y-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome!</h2>
      <p className="text-gray-500 mb-6 max-w-sm">Please select your role to continue.</p>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full max-w-sm">
        <button
          onClick={() => setCurrentRole('student')}
          className="w-full flex justify-center py-3 px-4 border-2 border-blue-600 text-lg font-bold text-blue-600 bg-white rounded-lg shadow-sm hover:bg-blue-50 transition duration-150"
        >
          I am a Student
        </button>
        <button
          onClick={() => setCurrentRole('tutor')}
          className="w-full flex justify-center py-3 px-4 border-2 border-green-600 text-lg font-bold text-green-600 bg-white rounded-lg shadow-sm hover:bg-green-50 transition duration-150"
        >
          I am a Tutor
        </button>
      </div>
    </div>
  );

  // A component to render the Login form for a specific role.
  const LoginForm = ({ role }) => (
    <form className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {role === 'student' ? 'Student Login' : 'Tutor Login'}
      </h2>
      <p className="text-gray-500 mb-6">Please log in to your account.</p>
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input type="email" id="login-email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" placeholder="you@example.com" required />
      </div>
      <div>
        <div className="flex justify-between items-center">
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
          <a href="#" onClick={() => setCurrentForm('forgotPassword')} className="text-sm text-blue-600 hover:text-blue-500 transition duration-150">Forgot Password?</a>
        </div>
        <input type="password" id="login-password" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" placeholder="********" required />
      </div>
      <div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">
          Login as {role === 'student' ? 'Student' : 'Tutor'}
        </button>
      </div>
      <div className="text-center text-sm">
        <span className="text-gray-600">Don't have an account?</span>
        <a href="#" onClick={() => setCurrentForm('signup')} className="font-medium text-blue-600 hover:text-blue-500 ml-1 transition duration-150">Sign Up</a>
      </div>
      <div className="text-center text-sm">
        <a href="#" onClick={() => setCurrentRole(null)} className="font-medium text-gray-600 hover:text-gray-800 ml-1 transition duration-150">Change Role</a>
      </div>
    </form>
  );

  // A component for Student Signup. It includes a specific field for grade level.
  const StudentSignupForm = () => (
    <form className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Sign Up</h2>
      <p className="text-gray-500 mb-6">Join us to start learning!</p>
      <div>
        <label htmlFor="student-signup-name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input type="text" id="student-signup-name" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" placeholder="John Doe" required />
      </div>
      <div>
        <label htmlFor="student-signup-email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input type="email" id="student-signup-email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" placeholder="you@example.com" required />
      </div>
      <div>
        <label htmlFor="student-signup-password" className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" id="student-signup-password" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" placeholder="********" required />
      </div>
      <div>
        <label htmlFor="student-signup-grade" className="block text-sm font-medium text-gray-700">Grade Level</label>
        <input type="text" id="student-signup-grade" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" placeholder="e.g., 10th Grade" />
      </div>
      <div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150">
          Sign Up as Student
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

  // A component for Tutor Signup. It includes a specific field for subjects.
  const TutorSignupForm = () => (
    <form className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Tutor Sign Up</h2>
      <p className="text-gray-500 mb-6">Join us to share your knowledge!</p>
      <div>
        <label htmlFor="tutor-signup-name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input type="text" id="tutor-signup-name" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" placeholder="John Doe" required />
      </div>
      <div>
        <label htmlFor="tutor-signup-email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input type="email" id="tutor-signup-email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" placeholder="you@example.com" required />
      </div>
      <div>
        <label htmlFor="tutor-signup-password" className="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" id="tutor-signup-password" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" placeholder="********" required />
      </div>
      <div>
        <label htmlFor="tutor-signup-subjects" className="block text-sm font-medium text-gray-700">Subjects you teach</label>
        <input type="text" id="tutor-signup-subjects" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150" placeholder="e.g., Math, Science" />
      </div>
      <div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150">
          Sign Up as Tutor
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

  // A component to render the Forgot Password form.
  const ForgotPasswordForm = () => (
    <form className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
      <p className="text-gray-500 mb-6">Enter your email to receive a reset link.</p>
      <div>
        <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input type="email" id="forgot-email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150" placeholder="you@example.com" required />
      </div>
      <div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition duration-150">
          Reset Password
        </button>
      </div>
      <div className="text-center text-sm">
        <a href="#" onClick={() => setCurrentForm('login')} className="font-medium text-blue-600 hover:text-blue-500 ml-1 transition duration-150">Back to Login</a>
      </div>
      <div className="text-center text-sm">
        <a href="#" onClick={() => setCurrentRole(null)} className="font-medium text-gray-600 hover:text-gray-800 ml-1 transition duration-150">Change Role</a>
      </div>
    </form>
  );

  // A function to conditionally render the correct form based on state.
  const renderForm = () => {
    // If a role hasn't been selected, show the role selection screen.
    if (!currentRole) {
      return <RoleSelection />;
    }

    // Otherwise, show the correct form based on the current form state and role.
    switch (currentForm) {
      case 'signup':
        return currentRole === 'student' ? <StudentSignupForm /> : <TutorSignupForm />;
      case 'forgotPassword':
        return <ForgotPasswordForm />;
      case 'login':
      default:
        return <LoginForm role={currentRole} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mt-20">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-xl w-full max-w-6xl overflow-hidden">
        {/* Left Side: Image */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <img
            src={fi1}
            alt="A group of people"
            className="relative z-10 w-full h-auto object-cover rounded-3xl shadow-lg"
          />
        </div>

        {/* Right Side: Forms Container */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

// Export the App component as the default export.
export default App;
