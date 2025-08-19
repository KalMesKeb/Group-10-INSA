import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import TutorRegistration from './components/TutorRegistration';
import StudentDashboard from './components/StudentDashboard';
import TutorProfile from './components/TutorProfile';
import AuthModal from './components/AuthModal';
import Login from './pages/Login';

import AboutUs from './pages/about';
import AdminDashboard from './components/AdminDashboard';
import LiveSessionRoom from './components/LiveSessionRoom';
import DisputeReport from './components/DisputeReport';
import TutorList from './components/TutorList';
import TutorDashboard from './components/TutorDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [liveRoomId, setLiveRoomId] = useState(null);
  const [tutorProfileData, setTutorProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const handleAuthSuccess = (user) => {
    setLoggedInUser(user);
    setIsAuthModalOpen(false);

    if (user.role === 'admin') {
      navigate('admin-dashboard');
    } else if (user.role === 'tutor') {
      navigate('tutor-dashboard');
    } else {
      navigate('student-dashboard');
    }
  };

  const handleTutorRegistrationSuccess = (profileData) => {
    setTutorProfileData(profileData);
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
    if (loggedInUser?.role === 'student') {
      navigate('student-dashboard');
    } else if (loggedInUser?.role === 'tutor') {
      navigate('tutor-dashboard');
    } else {
      navigate('home');
    }
  };

  const ProtectedWrapper = ({ children, allowedRoles = [] }) => {
    if (!loggedInUser) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full text-gray-800 p-6 text-center">
          <p className="mb-6">Please first Register to Become a tutor</p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="cursor-pointer px-6 py-2 bg-green-600 text-white font-medium rounded-full shadow-md hover:bg-green-700 transition-colors"
          >
            Register
          </button>
        </div>
      );
    }

    if (!allowedRoles.includes(loggedInUser.role)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full text-gray-800 p-6 text-center">
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

    return children;
  };

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // The main return block where we render the correct page.
  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <Header
        navigate={navigate}
        onLoginClick={() => setIsAuthModalOpen(true)}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full">
        {/* Public Pages */}
        {currentPage === 'home' && (
          <HomePage 
            navigate={navigate} 
            onLoginClick={() => setIsAuthModalOpen(true)}
            loggedInUser={loggedInUser}
            onLogout={handleLogout}
          />
        )}
        
        {currentPage === 'login' && <Login navigate={navigate} />}
      
        {currentPage === 'about' && <AboutUs />}
        {currentPage === 'tutor-list' && <TutorList />}

        {/* Protected Pages */}
        {currentPage === 'student-dashboard' && (
          <ProtectedWrapper allowedRoles={['student']}>
            <StudentDashboard
              joinLiveSession={joinLiveSession}
              loggedInUser={loggedInUser}
              onLoginClick={() => setIsAuthModalOpen(true)}
            />
          </ProtectedWrapper>
        )}

        {currentPage === 'tutor-register' && (
          <ProtectedWrapper allowedRoles={['tutor']}>
            <TutorRegistration onRegistrationSuccess={handleTutorRegistrationSuccess} />
          </ProtectedWrapper>
        )}
        
        {currentPage === 'tutor-dashboard' && (
          <ProtectedWrapper allowedRoles={['tutor']}>
            <TutorDashboard
              loggedInUser={loggedInUser}
              joinLiveSession={joinLiveSession}
            />
          </ProtectedWrapper>
        )}

        {currentPage === 'dispute' && (
          <ProtectedWrapper allowedRoles={['student', 'tutor']}>
            <DisputeReport loggedInUser={loggedInUser} />
          </ProtectedWrapper>
        )}

        {currentPage === 'live-session' && (
          <ProtectedWrapper allowedRoles={['student', 'tutor']}>
            <LiveSessionRoom 
              roomId={liveRoomId} 
              onLeave={leaveLiveSession} 
              className="w-full h-full"
            />
          </ProtectedWrapper>
        )}

        {currentPage === 'tutor-profile' && (
          <ProtectedWrapper allowedRoles={['tutor']}>
            <TutorProfile profileData={tutorProfileData} />
          </ProtectedWrapper>
        )}

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