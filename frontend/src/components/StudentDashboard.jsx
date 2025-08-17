// src/components/StudentDashboard.js

import React, { useState, useEffect } from 'react';
import { FaCalendarCheck, FaUsers, FaCalendarAlt, FaBook, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { approvedTutors, bookedSessions, addBookedSession, updateBookedSession, deleteBookedSession } from './dataStore';

// Main component for the Student Dashboard
const StudentDashboard = ({ loggedInUser, joinLiveSession, onLoginClick }) => {
    const [tutors, setTutors] = useState([]);
    const [scheduledSessions, setScheduledSessions] = useState([]);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [sessionToModify, setSessionToModify] = useState(null);
    const [subjectQuery, setSubjectQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [activeView, setActiveView] = useState('sessions'); // State to control which main view is active
    const [bookedDays, setBookedDays] = useState(new Set());

    useEffect(() => {
        setTutors(approvedTutors);
        // Only load booked sessions for the current logged-in user
        if (loggedInUser && loggedInUser.role === 'student') {
            const userSessions = bookedSessions.filter(session => session.studentId === loggedInUser.id);
            setScheduledSessions(userSessions);
        } else {
            setScheduledSessions([]);
        }
    }, [loggedInUser]);

    // This effect runs whenever scheduledSessions changes to update the calendar
    useEffect(() => {
        const days = new Set();
        scheduledSessions.forEach(session => {
            const date = new Date(session.date);
            days.add(date.getDate()); // Get the day of the month
        });
        setBookedDays(days);
    }, [scheduledSessions]);

    const handleBookTutor = (tutor) => {
        // Check if the user is logged in as a student
        if (!loggedInUser || loggedInUser.role !== 'student') {
            // Use the onLoginClick prop to trigger the login modal
            onLoginClick();
            return;
        }

        setSelectedTutor(tutor);
        setSessionToModify(null);
        setBookingDate('');
        setBookingTime('');
        setIsBookingModalOpen(true);
    };

    const handleEditSession = (session) => {
        // Make sure the logged-in user is the one who booked the session
        if (!loggedInUser || session.studentId !== loggedInUser.id) {
            // Use a custom modal or message box instead of alert()
            console.error('You can only edit your own sessions.');
            return;
        }

        setSelectedTutor(approvedTutors.find(t => t.name === session.tutorName));
        setSessionToModify(session);
        setBookingDate(session.date);
        setBookingTime(session.time);
        setIsBookingModalOpen(true);
    };

    const handleDeleteSession = (sessionId) => {
        // In a real app, you would also need to check the user ID here
        if (!loggedInUser) {
            console.error('You must be logged in to delete a session.');
            return;
        }

        deleteBookedSession(sessionId);
        setScheduledSessions(prev => prev.filter(session => session.id !== sessionId));
    };

    const handleConfirmBooking = () => {
        if (!bookingDate || !bookingTime) {
            console.error('Please select a date and time.');
            return;
        }

        if (sessionToModify) {
            const updatedSession = {
                ...sessionToModify,
                date: bookingDate,
                time: bookingTime,
            };
            updateBookedSession(updatedSession);
            setScheduledSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
        } else {
            const newSession = {
                id: `session-${Date.now()}`,
                tutorName: selectedTutor.name,
                studentName: loggedInUser.name,
                studentId: loggedInUser.id, // Add the student's ID for filtering
                subject: selectedTutor.subjects[0],
                date: bookingDate,
                time: bookingTime,
                status: 'Booked',
            };
            addBookedSession(newSession);
            setScheduledSessions(prev => [...prev, newSession]);
        }

        setIsBookingModalOpen(false);
        setBookingDate('');
        setBookingTime('');
        setSelectedTutor(null);
        setSessionToModify(null);
    };

    const handleCancelBooking = () => {
        setIsBookingModalOpen(false);
        setBookingDate('');
        setBookingTime('');
        setSelectedTutor(null);
        setSessionToModify(null);
    };
    
    // Function to filter tutors based on search queries
    const filteredTutors = tutors.filter(tutor => {
        const subjectMatch = subjectQuery
            ? tutor.subjects.some(subject => subject.toLowerCase().includes(subjectQuery.toLowerCase()))
            : true;
        
        const locationMatch = locationQuery
            ? tutor.location.toLowerCase().includes(locationQuery.toLowerCase())
            : true;

        const priceMinMatch = minPrice !== ''
            ? tutor.price >= parseFloat(minPrice)
            : true;
        
        const priceMaxMatch = maxPrice !== ''
            ? tutor.price <= parseFloat(maxPrice)
            : true;

        return subjectMatch && locationMatch && priceMinMatch && priceMaxMatch;
    });

    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); // 0 for Sunday, 1 for Monday, etc.

    // Create an array of day elements for the calendar
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="p-1"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const isBooked = bookedDays.has(i);
        const isToday = i === today.getDate();
        calendarDays.push(
            <div 
                key={i} 
                className={`p-1 rounded-full ${isBooked ? 'bg-indigo-600 text-white' : isToday ? 'bg-yellow-400 text-black' : 'text-gray-800'}`}
            >
                {i}
            </div>
        );
    }

    return (
        <div className="flex bg-gray-100 min-h-screen font-inter mt-30">
            {/* Sidebar */}
            <div className="w-1/4 min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-r-[40px] shadow-2xl p-8 flex flex-col justify-between">
                <div>
                    {/* User profile section removed */}
                    <nav className="space-y-4">
                        <button onClick={() => setActiveView('sessions')} className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-white hover:bg-opacity-20 transition-colors cursor-pointer">
                            <FaCalendarCheck className="text-xl" />
                            <span className="font-semibold">Booked Sessions</span>
                        </button>
                        <button onClick={() => setActiveView('tutors')} className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-white hover:bg-opacity-20 transition-colors cursor-pointer">
                            <FaUsers className="text-xl" />
                            <span className="font-semibold">Available Tutors</span>
                        </button>
                        <button onClick={() => setActiveView('calendar')} className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-white hover:bg-opacity-20 transition-colors cursor-pointer">
                            <FaCalendarAlt className="text-xl" />
                            <span className="font-semibold">Calendar</span>
                        </button>
                    </nav>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                   
                    <div className="flex space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by subject..."
                                value={subjectQuery}
                                onChange={(e) => setSubjectQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow w-48"
                            />
                            <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by location..."
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow w-48"
                            />
                            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative flex items-center space-x-2">
                            <input
                                type="number"
                                placeholder="Min price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="pl-8 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow w-28"
                            />
                            <span className="text-gray-500">-</span>
                            <input
                                type="number"
                                placeholder="Max price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="pl-8 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow w-28"
                            />
                            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </header>

                {activeView === 'sessions' && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Your Booked Sessions ({scheduledSessions.length})</h2>
                        {scheduledSessions.length > 0 ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {scheduledSessions.map(session => (
                                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                                        <div>
                                            <p className="font-semibold text-lg text-gray-900">{session.tutorName}</p>
                                            <p className="text-sm text-indigo-600 font-medium">{session.subject}</p>
                                            <p className="text-xs text-gray-500 mt-1">{session.date} at {session.time}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => joinLiveSession(session.id)} className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-full text-xs font-semibold cursor-pointer">Join</button>
                                            <button onClick={() => handleEditSession(session)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-full text-xs font-semibold cursor-pointer">Edit</button>
                                            <button onClick={() => handleDeleteSession(session.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full text-xs font-semibold cursor-pointer">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">You have no booked sessions.</p>
                        )}
                    </div>
                )}
                
                {activeView === 'tutors' && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Available Tutors</h3>
                        {filteredTutors.length > 0 ? (
                            <div className="space-y-4">
                                {filteredTutors.map(tutor => (
                                    <div key={tutor.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg shadow-sm">
                                        <img src={tutor.profilePic} alt={tutor.name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500" />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{tutor.name}</p>
                                            <p className="text-xs text-gray-600">{tutor.subjects.join(', ')}</p>
                                            <p className="text-xs text-gray-600 font-bold mt-1">${tutor.price}/hr</p>
                                        </div>
                                        <button
                                            onClick={() => handleBookTutor(tutor)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-4 rounded-full text-xs font-semibold transition-transform transform hover:scale-105 cursor-pointer"
                                        >
                                            Book
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-2">No tutors match your search criteria.</p>
                        )}
                    </div>
                )}

                {activeView === 'calendar' && (
                     <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Calendar</h3>
                            <div className="text-sm text-gray-500">{currentMonth}, {currentYear}</div>
                        </div>
                        <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 mb-2">
                            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                        </div>
                        <div className="grid grid-cols-7 text-center text-sm">
                            {calendarDays}
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {isBookingModalOpen && selectedTutor && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">
                            {sessionToModify ? `Edit Session with ${selectedTutor.name}` : `Book Session with ${selectedTutor.name}`}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Select a Date:</label>
                            <input
                                type="date"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Select a Time:</label>
                            <input
                                type="time"
                                value={bookingTime}
                                onChange={(e) => setBookingTime(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCancelBooking}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition-transform cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmBooking}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition-transform cursor-pointer"
                            >
                                {sessionToModify ? 'Save Changes' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
