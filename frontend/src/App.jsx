// src/App.jsx

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import TutorRegistration from './components/TutorRegistration';
import StudentDashboard from './components/StudentDashboard';
import TutorProfile from './components/TutorProfile';
import AuthModal from './components/AuthModal';
import Login from './pages/Login';
import Contact from './pages/contact';
import AboutUs from './pages/about';
import AdminDashboard from './components/AdminDashboard';
import LiveSessionRoom from './components/LiveSessionRoom';
import DisputeReport from './components/DisputeReport';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [liveRoomId, setLiveRoomId] = useState(null);
  // NEW: State to hold the registered tutor's profile data
  const [tutorProfileData, setTutorProfileData] = useState(null);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleAuthSuccess = (user) => {
    setLoggedInUser(user);
    setIsAuthModalOpen(false);

    if (user.role === 'admin') {
      navigate('admin-dashboard');
    } else if (user.role === 'tutor') {
      // NOTE: We'll update this logic later to handle pre-filled profiles
      navigate('tutor-profile');
    } else {
      navigate('student-dashboard');
    }
  };

  // NEW: Function to handle a successful tutor registration
  const handleTutorRegistrationSuccess = (profileData) => {
    // Save the submitted profile data to state
    setTutorProfileData(profileData);
    // Navigate the user to their profile page
    navigate('tutor-profile');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    navigate('home');
  };

  const joinLiveSession = (roomId) => {
    setLiveRoomId(roomId);
    navigate('live-session');
  };

  const leaveLiveSession = () => {
    setLiveRoomId(null);
    navigate('student-dashboard');
  };

  // This is the new component for controlling access to pages.
  // It checks if the user is logged in and has one of the allowed roles.
  const ProtectedWrapper = ({ children, allowedRoles = [] }) => {
    // Check if a user is logged in.
    if (!loggedInUser) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-gray-800 p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-6">Please log in to view this page.</p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full shadow-md hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </div>
      );
    }

    // Check if the logged-in user's role is in the list of allowed roles.
    if (!allowedRoles.includes(loggedInUser.role)) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-gray-800 p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-6">You do not have the required permissions to view this page.</p>
          <button
            onClick={() => navigate('home')}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full shadow-md hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      );
    }

    // If both checks pass, render the child components (the page).
    return children;
  };

  // The main return block where we render the correct page.
  return (
    <div className="h-screen w-screen flex flex-col bg-white-100">
      <Header
        navigate={navigate}
        onLoginClick={() => setIsAuthModalOpen(true)}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />

      <main className="flex-grow container mx-auto p-4">
        {/* Public Pages */}
        {currentPage === 'home' && <HomePage navigate={navigate} />}
        {currentPage === 'login' && <Login navigate={navigate} />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'about' && <AboutUs />}

        {currentPage === 'student-dashboard' && (
          <ProtectedWrapper allowedRoles={['student']}>

            <StudentDashboard
            joinLiveSession={joinLiveSession}
            loggedInUser={loggedInUser}
            onLoginClick={() => setIsAuthModalOpen(true)}
          />
          </ProtectedWrapper>
          
        )}

        {/* Protected Pages */}
        {/* Tutor Registration */}
        {currentPage === 'tutor-register' && (
          <ProtectedWrapper allowedRoles={['tutor']}>
            {/* UPDATED: Pass the new callback function as a prop */}
            <TutorRegistration onRegistrationSuccess={handleTutorRegistrationSuccess} />
          </ProtectedWrapper>
        )}

        {/* Dispute Reporting */}
        {currentPage === 'dispute' && (
          <ProtectedWrapper allowedRoles={['student', 'tutor']}>
            <DisputeReport loggedInUser={loggedInUser} />
          </ProtectedWrapper>
        )}

        {/* Live Session Room */}
        {currentPage === 'live-session' && (
          <ProtectedWrapper allowedRoles={['student', 'tutor']}>
            <LiveSessionRoom roomId={liveRoomId} onLeave={leaveLiveSession} />
          </ProtectedWrapper>
        )}

        {/* Tutor Profile */}
        {currentPage === 'tutor-profile' && (
          <ProtectedWrapper allowedRoles={['tutor']}>
            {/* UPDATED: Pass the profile data from state as a prop */}
            <TutorProfile profileData={tutorProfileData} />
          </ProtectedWrapper>
        )}

        {/* Admin Dashboard */}
        {currentPage === 'admin-dashboard' && (
          <ProtectedWrapper allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedWrapper>
        )}
      </main>

      <Footer />

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

export default App;
