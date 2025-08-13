// StudentDashboard.js

import React, { useState, useEffect } from 'react';
import { approvedTutors } from './dataStore';

// Main component for the Student Dashboard
const StudentDashboard = ({ joinLiveSession }) => {
    // State for search filters
    const [filters, setFilters] = useState({
        subject: '',
        location: '',
        priceRange: [0, 100],
        rating: 0,
    });

    // Initialize with approvedTutors from the data store
    const [allTutors, setAllTutors] = useState(approvedTutors);
    const [searchResults, setSearchResults] = useState(approvedTutors);

    // This useEffect hook ensures the dashboard updates whenever a new tutor is approved.
    useEffect(() => {
        setAllTutors([...approvedTutors]);
        setSearchResults([...approvedTutors]);
    }, [approvedTutors]);

    // State to handle the selected tutor for detailed profile view
    const [selectedTutor, setSelectedTutor] = useState(null);

    // State to manage scheduled sessions, now dynamic
    const [scheduledSessions, setScheduledSessions] = useState([
        {
            id: 's1',
            tutorName: 'Nati Alemu',
            subject: 'Literature',
            date: '2025-08-15',
            time: '14:00',
            roomId: 'room-abc-123',
        },
        {
            id: 's2',
            tutorName: 'Mela Somon',
            subject: 'Algebra',
            date: '2025-08-16',
            time: '10:30',
            roomId: 'room-xyz-456',
        },
    ]);

    // States for the booking modal
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [tutorToBook, setTutorToBook] = useState(null);
    const [sessionToModify, setSessionToModify] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');

    // Handle changes in filter input fields
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Handle changes in the price range input fields
    const handlePriceRangeChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => {
            const newPriceRange = [...prev.priceRange];
            if (name === 'minPrice') newPriceRange[0] = Number(value);
            if (name === 'maxPrice') newPriceRange[1] = Number(value);
            return { ...prev, priceRange: newPriceRange };
        });
    };

    // Function to apply the filters and update search results
    const applyFilters = () => {
        let filtered = allTutors.filter((tutor) => {
            const subjectMatch = filters.subject
                ? tutor.subjects.some((s) => s.toLowerCase().includes(filters.subject.toLowerCase()))
                : true;
            const locationMatch = filters.location
                ? tutor.location.toLowerCase().includes(filters.location.toLowerCase())
                : true;
            const priceMatch =
                tutor.price >= filters.priceRange[0] && tutor.price <= filters.priceRange[1];
            const ratingMatch = tutor.rating >= filters.rating;
            return subjectMatch && locationMatch && priceMatch && ratingMatch;
        });
        setSearchResults(filtered);
    };

    // Function to handle booking a session by opening the modal
    const bookSession = (tutor) => {
        setTutorToBook(tutor);
        setIsBookingModalOpen(true);
        setBookingDate('');
        setBookingTime('');
        setSessionToModify(null);
        setSelectedTutor(null);
    };

    // Function to confirm the schedule and add it to the sessions list
    const handleConfirmBooking = () => {
        if (!bookingDate || !bookingTime) {
            alert('Please select a date and time.');
            return;
        }

        if (sessionToModify) {
            // Modify existing session
            setScheduledSessions(prev =>
                prev.map(session =>
                    session.id === sessionToModify.id
                        ? { ...session, date: bookingDate, time: bookingTime }
                        : session
                )
            );
        } else {
            // Add new session
            const newSession = {
                id: `s${Date.now()}`, // Simple unique ID
                tutorName: tutorToBook.name,
                subject: tutorToBook.subjects[0], // Assumes one main subject
                date: bookingDate,
                time: bookingTime,
                roomId: `room-${Math.random().toString(36).substring(7)}`, // Generate a random room ID
            };
            setScheduledSessions(prev => [...prev, newSession]);
        }

        // Close the modal
        setIsBookingModalOpen(false);
    };

    // Function to delete a scheduled session
    const deleteSession = (sessionId) => {
        setScheduledSessions(prev => prev.filter(session => session.id !== sessionId));
    };

    // Function to modify a scheduled session
    const modifySession = (session) => {
        setSessionToModify(session);
        setTutorToBook({ name: session.tutorName, subjects: [session.subject] });
        setBookingDate(session.date);
        setBookingTime(session.time);
        setIsBookingModalOpen(true);
    };


    // If a tutor is selected, show their detailed profile
    if (selectedTutor) {
        return (
            <div className="max-w-4xl mx-auto py-8 mt-20">
                <button
                    onClick={() => setSelectedTutor(null)}
                    className="mb-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    &larr; Back to Tutors
                </button>
                <div className="bg-white p-8 rounded-lg shadow-2xl flex flex-col items-center text-center md:flex-row md:text-left">
                    <img
                        src={selectedTutor.profilePic}
                        alt={`${selectedTutor.name}'s profile`}
                        className="w-40 h-40 rounded-full object-cover mb-6 md:mb-0 md:mr-8 border-4 border-indigo-400"
                    />
                    <div className="flex-1">
                        <h2 className="text-3xl font-extrabold text-gray-900">{selectedTutor.name}</h2>
                        <p className="text-gray-600 text-lg mb-2">{selectedTutor.subjects.join(', ')}</p>
                        <p className="text-green-600 font-bold text-xl mb-2">Birr{selectedTutor.price}/hour</p>
                        <div className="flex items-center justify-center md:justify-start text-yellow-500 mb-4">
                            <span>{'⭐'.repeat(Math.floor(selectedTutor.rating))}</span>
                            <span className="text-gray-600 ml-1">({selectedTutor.rating})</span>
                        </div>
                        <p className="text-gray-700 mb-4">{selectedTutor.bio}</p>
                        <button
                            onClick={() => bookSession(selectedTutor)}
                            className="bg-green-400 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            Book Session
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Render the list of tutors by default
    return (
        <div className="max-w-6xl mx-auto py-8">
            <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10 mt-15">Find Your Perfect Tutor</h2>

            {/* Booking Modal */}
            {isBookingModalOpen && tutorToBook && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-4">{sessionToModify ? 'Modify Session' : 'Book a Session'} with {tutorToBook.name}</h3>
                        <p className="mb-4 text-gray-600">Subject: {tutorToBook.subjects[0]}</p>

                        <div className="mb-4">
                            <label htmlFor="bookingDate" className="block text-gray-700 font-bold mb-2">Select Date</label>
                            <input
                                type="date"
                                id="bookingDate"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="bookingTime" className="block text-gray-700 font-bold mb-2">Select Time</label>
                            <input
                                type="time"
                                id="bookingTime"
                                value={bookingTime}
                                onChange={(e) => setBookingTime(e.target.value)}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsBookingModalOpen(false)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmBooking}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                {sessionToModify ? 'Update Schedule' : 'Confirm Schedule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Scheduled Sessions Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Scheduled Sessions</h3>
                {scheduledSessions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-20">
                        {scheduledSessions.map(session => (
                            <div key={session.id} className="bg-black-900 rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                                <div>
                                    <p className="text-gray-700 font-semibold">{session.subject} with {session.tutorName}</p>
                                    <p className="text-gray-500 text-sm">{session.date} at {session.time}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => modifySession(session)}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-full text-sm"
                                    >
                                        Modify
                                    </button>
                                    <button
                                        onClick={() => deleteSession(session.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => joinLiveSession(session.roomId)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105"
                                    >
                                        Join
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">You have no upcoming sessions.</p>
                )}
            </div>

            {/* Your original Filter Tutors Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Search Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={filters.subject}
                            onChange={handleFilterChange}
                            placeholder="e.g., Math, English"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={filters.location}
                            onChange={handleFilterChange}
                            placeholder="e.g., New York, Online"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Price Range (Birr)</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                name="minPrice"
                                className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={filters.priceRange[0]}
                                onChange={handlePriceRangeChange}
                                min="0"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                name="maxPrice"
                                className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={filters.priceRange[1]}
                                onChange={handlePriceRangeChange}
                                min="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                            Min Rating (Stars)
                        </label>
                        <input
                            type="number"
                            id="rating"
                            name="rating"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={filters.rating}
                            onChange={handleFilterChange}
                            min="0"
                            max="5"
                            step="0.1"
                        />
                    </div>
                </div>
                <button
                    onClick={applyFilters}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors w-full md:w-auto"
                >
                    Apply Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.length > 0 ? (
                    searchResults.map((tutor) => (
                        <div key={tutor.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                            <img
                                src={tutor.profilePic}
                                alt={`${tutor.name}'s profile`}
                                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-blue-400"
                            />
                            <h3 className="text-xl font-semibold text-gray-800">{tutor.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">{tutor.subjects.join(', ')}</p>
                            <p className="text-green-600 font-bold text-lg mb-2">Birr{tutor.price}/hour</p>
                            <div className="flex items-center text-yellow-500 mb-4">
                                <span>{'⭐'.repeat(Math.floor(tutor.rating))}</span>
                                <span className="text-gray-600 ml-1">({tutor.rating})</span>
                            </div>
                            <p className="text-gray-700 text-sm mb-4">{tutor.bio.substring(0, 70)}...</p>
                            <button
                                onClick={() => setSelectedTutor(tutor)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                                View Profile
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600 text-lg col-span-full">No tutors found matching your criteria. Try adjusting your filters!</p>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;