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
import DisputeReport from './components/DisputeReport'; // Correct path to the dispute page



function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); // Simulate logged in user
  const [liveRoomId, setLiveRoomId] = useState(null);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleAuthSuccess = (user) => {
    setLoggedInUser(user);
    setIsAuthModalOpen(false);
    
    if (user.role === 'admin') {
      navigate('admin-dashboard');
    } else if (user.role === 'tutor') {
      navigate('tutor-profile');
    } else {
      navigate('student-dashboard');
    }


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

  

  return (
    <div className="h-screen w-screen flex flex-col bg-white-100">
      
      <Header
        navigate={navigate}
        onLoginClick={() => setIsAuthModalOpen(true)}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />

      <main className="flex-grow container mx-auto p-4">
        {currentPage === 'home' && <HomePage navigate={navigate} />}
        {currentPage === 'login' && <Login navigate={navigate} />}
        {currentPage === 'tutor-register' && <TutorRegistration />}
        {currentPage === 'student-dashboard' && <StudentDashboard joinLiveSession={joinLiveSession} />}
        {currentPage === 'tutor-profile' && <TutorProfile />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'about' && <AboutUs />}
        {currentPage === 'admin-dashboard' && <AdminDashboard />}
        {currentPage === 'live-session' && (
          <LiveSessionRoom roomId={liveRoomId} onLeave={leaveLiveSession} />
        )}
        {currentPage === 'dispute' && <DisputeReport />} {/* Added the dispute page */}
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
