// src/components/StudentDashboard.js
import React, { useState, useEffect } from 'react';
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
            alert('You can only edit your own sessions.');
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
            alert('You must be logged in to delete a session.');
            return;
        }

        deleteBookedSession(sessionId);
        setScheduledSessions(prev => prev.filter(session => session.id !== sessionId));
    };

    const handleConfirmBooking = () => {
        if (!bookingDate || !bookingTime) {
            alert('Please select a date and time.');
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

    const sectionTitleStyle = "text-3xl font-bold text-gray-800 mb-6 border-b pb-2";
    const listContainerStyle = "bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8";
    const itemStyle = "flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0";

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 mt-24">
          

            {/* Booked Sessions Section */}
            <div className={listContainerStyle}>
                <h2 className={sectionTitleStyle}>Your Booked Sessions ({scheduledSessions.length})</h2>
                {scheduledSessions.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {scheduledSessions.map(session => (
                            <li key={session.id} className={itemStyle}>
                                <div>
                                    <p className="font-semibold text-lg">Tutor: {session.tutorName}</p>
                                    <p className="text-sm text-gray-600">Subject: {session.subject}</p>
                                    <p className="text-sm text-gray-500">Date: {session.date} at {session.time}</p>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleEditSession(session)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSession(session.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => joinLiveSession(session.id)}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105"
                                    >
                                        Join Session
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">You have no booked sessions. Find a tutor to get started!</p>
                )}
            </div>

            <hr className="my-12 border-gray-300" />

            {/* Available Tutors Section */}
            <div className={listContainerStyle}>
                <h2 className={sectionTitleStyle}>Available Tutors ({tutors.length})</h2>
                {tutors.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tutors.map(tutor => (
                            <li key={tutor.id} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center space-x-4 mb-4">
                                    <img src={tutor.profilePic} alt={tutor.name} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500" />
                                    <div>
                                        <p className="font-bold text-xl">{tutor.name}</p>
                                        <p className="text-sm text-gray-600">{tutor.subjects.join(', ')}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{tutor.bio}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-900">{tutor.price} Birr/hr</span>
                                    <button
                                        onClick={() => handleBookTutor(tutor)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition-transform transform hover:scale-105"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">No tutors are available at this time. Please check back later.</p>
                )}
            </div>

            {/* Booking Modal */}
            {isBookingModalOpen && selectedTutor && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
                        <h3 className="text-2xl font-bold mb-4">
                            {sessionToModify ? `Edit Session with ${selectedTutor.name}` : `Book Session with ${selectedTutor.name}`}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Select a Date:</label>
                            <input
                                type="date"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">Select a Time:</label>
                            <input
                                type="time"
                                value={bookingTime}
                                onChange={(e) => setBookingTime(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCancelBooking}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition-transform"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmBooking}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition-transform"
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
