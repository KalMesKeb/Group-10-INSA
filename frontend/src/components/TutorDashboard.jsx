// src/components/TutorDashboard.js

import React, { useState, useEffect } from 'react';
import { FaCalendarCheck, FaCalendarAlt, FaUserCircle, FaBook, FaClock } from 'react-icons/fa';
import { bookedSessions } from './dataStore';

// Main component for the Tutor Dashboard
const TutorDashboard = ({ loggedInUser, joinLiveSession }) => {
    const [scheduledSessions, setScheduledSessions] = useState([]);
    const [activeView, setActiveView] = useState('sessions'); // State to control which main view is active
    const [bookedDays, setBookedDays] = useState(new Set());

    useEffect(() => {
        // Filter booked sessions to show only those for the logged-in tutor
        if (loggedInUser && loggedInUser.role === 'tutor') {
            const tutorSessions = bookedSessions.filter(session => session.tutorName === loggedInUser.name);
            setScheduledSessions(tutorSessions);
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
                className={`p-1 rounded-full ${isBooked ? 'bg-green-600 text-white' : isToday ? 'bg-yellow-400 text-black' : 'text-gray-800'}`}
            >
                {i}
            </div>
        );
    }

    return (
        <div className="flex bg-gray-100 min-h-screen font-inter mt-30">
            {/* Sidebar */}
            <div className="w-1/4 min-h-screen bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-r-[40px] shadow-2xl p-8 flex flex-col justify-between">
                <div>
                    <div className="flex items-center space-x-4 mb-8">
                        <FaUserCircle className="text-6xl text-white" />
                        <div>
                            <p className="text-xl font-bold">Hello, Tutor!</p>
                            <p className="text-sm font-light opacity-80">{loggedInUser ? loggedInUser.name : 'Guest'}</p>
                        </div>
                    </div>
                    <nav className="space-y-4">
                        <button onClick={() => setActiveView('sessions')} className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-white hover:bg-opacity-20 transition-colors cursor-pointer">
                            <FaCalendarCheck className="text-xl" />
                            <span className="font-semibold">My Sessions</span>
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
               

                {activeView === 'sessions' && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Your Booked Sessions ({scheduledSessions.length})</h2>
                        {scheduledSessions.length > 0 ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {scheduledSessions.map(session => (
                                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                                        <div>
                                            <p className="font-semibold text-lg text-gray-900">Student: {session.studentName}</p>
                                            <p className="text-sm text-green-600 font-medium">{session.subject}</p>
                                            <p className="text-xs text-gray-500 mt-1">{session.date} at {session.time}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => joinLiveSession(session.id)} className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-full text-xs font-semibold cursor-pointer">Join</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">You have no booked sessions.</p>
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
        </div>
    );
};

export default TutorDashboard;
