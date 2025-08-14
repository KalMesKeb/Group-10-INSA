import React, { useState } from 'react';

const AuthModal = ({ onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@example.com' && password === 'password') {
      onAuthSuccess({ email: email, name: 'Admin User', role: 'admin' });
    } else if (email === 'tutor@example.com' && password === 'password') {
      onAuthSuccess({ email: email, name: 'Demo Tutor', role: 'tutor' });
    } else if (email === 'student@example.com' && password === 'password') {
      onAuthSuccess({ email: email, name: 'Demo Student', role: 'student' });
    } else {
      setError('Invalid email or password. Use "admin@example.com", "tutor@example.com" or "student@example.com" with password "password" for demo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold transition-colors">
          &times;
        </button>
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          {isLogin ? 'Login' : 'Create an Account'}
        </h2>

        {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">{error}</p>}

        <form onSubmit={handleAuth}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full w-full transition-transform transform hover:scale-105"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
        <p className="mt-4 text-center text-gray-500 text-sm">
          (For demo, use "admin@example.com", "tutor@example.com" or "student@example.com" with password "password")
        </p>
      </div>
    </div>
  );
};

export default AuthModal;