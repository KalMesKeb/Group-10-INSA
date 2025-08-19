// src/components/StudentDashboard.js

import React, { useState, useEffect } from 'react';
import { FaCalendarCheck, FaUsers, FaCalendarAlt, FaBook, FaMapMarkerAlt, FaDollarSign, FaSearch, FaUserCircle, FaChevronRight } from 'react-icons/fa';
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
    const [activeView, setActiveView] = useState('sessions');
    const [bookedDays, setBookedDays] = useState(new Set());
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        setTutors(approvedTutors);
        if (loggedInUser && loggedInUser.role === 'student') {
            const userSessions = bookedSessions.filter(session => session.studentId === loggedInUser.id);
            setScheduledSessions(userSessions);
        } else {
            setScheduledSessions([]);
        }
    }, [loggedInUser]);

    useEffect(() => {
        const days = new Set();
        scheduledSessions.forEach(session => {
            const date = new Date(session.date);
            days.add(date.getDate());
        });
        setBookedDays(days);
    }, [scheduledSessions]);

    const handleBookTutor = (tutor) => {
        if (!loggedInUser || loggedInUser.role !== 'student') {
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
        if (!loggedInUser || session.studentId !== loggedInUser.id) {
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
                studentId: loggedInUser.id,
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
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    const handleDateClick = (day) => {
        const selected = new Date(today.getFullYear(), today.getMonth(), day);
        const formattedDate = selected.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
        
        // If we're in tutor view and a tutor is selected, open booking modal
        if (activeView === 'tutors' && selectedTutor) {
            setBookingDate(formattedDate);
            setIsBookingModalOpen(true);
        }
    };

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="p-1"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const isBooked = bookedDays.has(i);
        const isToday = i === today.getDate();
        const isSelected = selectedDate && new Date(selectedDate).getDate() === i;
        
        calendarDays.push(
            <div 
                key={i} 
                className={`p-1 rounded-full cursor-pointer transition-all duration-200
                    ${isBooked ? 'bg-emerald-600 text-white' : 
                     isSelected ? 'bg-emerald-400 text-white ring-2 ring-emerald-300' :
                     isToday ? 'bg-yellow-400 text-black' : 'text-gray-800 hover:bg-emerald-100'}`}
                onClick={() => handleDateClick(i)}
            >
                {i}
            </div>
        );
    }

    return (
        <div className="flex bg-gray-50 min-h-screen font-inter mt-30">
            {/* Sidebar with green gradient */}
            <div className="w-64 min-h-screen bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-r-3xl shadow-xl p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-1">LearnHub</h1>
                    <p className="text-emerald-100 text-sm">Student Dashboard</p>
                </div>
                
                {loggedInUser ? (
                    <div className="flex items-center mb-8 p-3 bg-white bg-opacity-10 rounded-lg">
                        <FaUserCircle className="text-3xl mr-3 text-emerald-200" />
                        <div>
                            <p className="font-medium">{loggedInUser.name}</p>
                            <p className="text-xs text-emerald-200">Student</p>
                        </div>
                    </div>
                ) : null}

                <nav className="space-y-2 flex-1">
                    <button 
                        onClick={() => setActiveView('sessions')} 
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeView === 'sessions' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
                    >
                        <div className="flex items-center">
                            <FaCalendarCheck className="text-lg mr-3" />
                            <span className="font-medium">My Sessions</span>
                        </div>
                        <FaChevronRight className="text-xs" />
                    </button>
                    <button 
                        onClick={() => setActiveView('tutors')} 
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeView === 'tutors' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
                    >
                        <div className="flex items-center">
                            <FaUsers className="text-lg mr-3" />
                            <span className="font-medium">Find Tutors</span>
                        </div>
                        <FaChevronRight className="text-xs" />
                    </button>
                    <button 
                        onClick={() => setActiveView('calendar')} 
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeView === 'calendar' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
                    >
                        <div className="flex items-center">
                            <FaCalendarAlt className="text-lg mr-3" />
                            <span className="font-medium">Calendar</span>
                        </div>
                        <FaChevronRight className="text-xs" />
                    </button>
                </nav>

                <div className="mt-auto pt-4 border-t border-emerald-400 border-opacity-30">
                    <p className="text-emerald-200 text-xs text-center">© 2023 LearnHub</p>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {activeView === 'sessions' && 'My Learning Sessions'}
                        {activeView === 'tutors' && 'Find Your Tutor'}
                        {activeView === 'calendar' && 'Study Calendar'}
                    </h2>
                    
                    <div className="flex space-x-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Subject..."
                                value={subjectQuery}
                                onChange={(e) => setSubjectQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all w-48"
                            />
                            <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Location..."
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all w-48"
                            />
                            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative flex items-center space-x-2 bg-white rounded-full px-3 border border-gray-200">
                            <FaDollarSign className="text-gray-400" />
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="py-2 focus:outline-none w-16 text-sm"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="py-2 focus:outline-none w-16 text-sm"
                            />
                        </div>
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full shadow-md transition-transform hover:scale-105">
                            <FaSearch className="text-lg" />
                        </button>
                    </div>
                </header>

                {activeView === 'sessions' && (
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Upcoming Sessions ({scheduledSessions.length})</h2>
                            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        
                        {scheduledSessions.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {scheduledSessions.map(session => (
                                    <div key={session.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 border-emerald-400">
                                        <div>
                                            <p className="font-semibold text-gray-900">{session.tutorName}</p>
                                            <p className="text-sm text-emerald-600 font-medium">{session.subject}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} 
                                                <span className="mx-1">•</span>
                                                {session.time}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => joinLiveSession(session.id)} 
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white py-1 px-4 rounded-full text-xs font-semibold flex items-center transition-transform hover:scale-105"
                                            >
                                                Join
                                            </button>
                                            <button 
                                                onClick={() => handleEditSession(session)} 
                                                className="bg-amber-500 hover:bg-amber-600 text-white py-1 px-4 rounded-full text-xs font-semibold flex items-center transition-transform hover:scale-105"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteSession(session.id)} 
                                                className="bg-rose-500 hover:bg-rose-600 text-white py-1 px-3 rounded-full text-xs font-semibold flex items-center transition-transform hover:scale-105"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                    <FaCalendarCheck className="text-emerald-500 text-3xl" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 mb-1">No sessions booked yet</h3>
                                <p className="text-gray-500 text-sm">Find tutors and book your first session!</p>
                                <button 
                                    onClick={() => setActiveView('tutors')} 
                                    className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-6 rounded-full text-sm font-semibold transition-transform hover:scale-105"
                                >
                                    Browse Tutors
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                {activeView === 'tutors' && (
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Available Tutors ({filteredTutors.length})</h3>
                        {filteredTutors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredTutors.map(tutor => (
                                    <div key={tutor.id} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                                        <img src={tutor.profilePic} alt={tutor.name} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="font-semibold text-gray-900">{tutor.name}</p>
                                                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-bold">${tutor.price}/hr</span>
                                            </div>
                                            <p className="text-xs text-gray-600 mb-1">
                                                <FaMapMarkerAlt className="inline mr-1" />
                                                {tutor.location}
                                            </p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {tutor.subjects.map((subject, idx) => (
                                                    <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{subject}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedTutor(tutor);
                                                setIsBookingModalOpen(true);
                                            }}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-full text-sm font-semibold transition-transform hover:scale-105"
                                        >
                                            Book
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                    <FaUsers className="text-emerald-500 text-3xl" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 mb-1">No tutors found</h3>
                                <p className="text-gray-500 text-sm">Try adjusting your search filters</p>
                            </div>
                        )}
                    </div>
                )}

                {activeView === 'calendar' && (
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Study Calendar</h3>
                                <p className="text-sm text-gray-500">Track your booked sessions</p>
                            </div>
                            <div className="text-lg font-semibold text-gray-700">
                                {currentMonth} {currentYear}
                            </div>
                        </div>
                        <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 mb-3">
                            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                        </div>
                        <div className="grid grid-cols-7 text-center text-sm gap-1">
                            {calendarDays}
                        </div>
                        
                        {selectedDate && (
                            <div className="mt-8">
                                <h4 className="font-medium text-gray-800 mb-3">
                                    Sessions on {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h4>
                                {scheduledSessions.filter(session => {
                                    const sessionDate = new Date(session.date).toISOString().split('T')[0];
                                    return sessionDate === selectedDate;
                                }).length > 0 ? (
                                    <div className="space-y-2">
                                        {scheduledSessions.filter(session => {
                                            const sessionDate = new Date(session.date).toISOString().split('T')[0];
                                            return sessionDate === selectedDate;
                                        }).map(session => (
                                            <div key={session.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">{session.tutorName}</p>
                                                    <p className="text-sm text-emerald-600">{session.subject} at {session.time}</p>
                                                </div>
                                                <button 
                                                    onClick={() => joinLiveSession(session.id)}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white py-1 px-3 rounded-full text-xs font-semibold"
                                                >
                                                    Join
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm py-2">No sessions booked for this day</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {isBookingModalOpen && selectedTutor && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                        <div className="flex items-start mb-6">
                            <img src={selectedTutor.profilePic} alt={selectedTutor.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 mr-4" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {sessionToModify ? `Edit Session with` : `Book Session with`}
                                </h3>
                                <p className="text-lg font-semibold text-emerald-600">{selectedTutor.name}</p>
                                <p className="text-sm text-gray-600">{selectedTutor.subjects.join(', ')}</p>
                            </div>
                        </div>
                        
                        <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">Select Date</label>
                            <input
                                type="date"
                                value={bookingDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">Select Time</label>
                            <input
                                type="time"
                                value={bookingTime}
                                onChange={(e) => setBookingTime(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleCancelBooking}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-5 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmBooking}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-5 rounded-lg transition-colors shadow-md hover:shadow-lg"
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