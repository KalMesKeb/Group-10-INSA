// src/components/TutorList.jsx

import React, { useState, useEffect } from 'react';
import { getApprovedTutors } from './dataStore';

/**
 * A publicly viewable component that displays a list of approved tutors.
 * Tutors are fetched from the central data store.
 */
const TutorList = () => {
    // State to hold the list of tutors
    const [tutors, setTutors] = useState([]);

    // Fetch the list of approved tutors when the component mounts
    useEffect(() => {
        const approvedTutors = getApprovedTutors();
        setTutors(approvedTutors);
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8 md:p-12 mt-20">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-900 mb-12 border-b-4 border-indigo-600 pb-4">
                    Our Verfied Tutors
                </h1>
                
                {tutors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tutors.map(tutor => (
                            <div key={tutor.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
                                <div className="p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        {/* Tutor's profile picture */}
                                        <img
                                            src={tutor.profilePic}
                                            alt={`${tutor.name}'s profile`}
                                            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500"
                                        />
                                        <div>
                                            {/* Tutor's name and subjects */}
                                            <h2 className="text-xl font-bold text-gray-800">{tutor.name}</h2>
                                            <p className="text-sm text-indigo-600 font-semibold">{tutor.subjects.join(', ')}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Rating and price */}
                                    <div className="flex items-center space-x-2 text-yellow-500 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.62-.921 1.92 0l1.241 3.824a1 1 0 00.95.691h4.025c.969 0 1.371 1.24.588 1.81l-3.253 2.365a1 1 0 00-.362 1.118l1.241 3.824c.3.921-.755 1.688-1.54 1.118l-3.253-2.365a1 1 0 00-1.176 0l-3.253 2.365c-.785.57-1.84-.197-1.54-1.118l1.241-3.824a1 1 0 00-.362-1.118L2.245 9.252c-.783-.57-.381-1.81.588-1.81h4.025a1 1 0 00.95-.691l1.241-3.824z" />
                                        </svg>
                                        <span className="font-bold text-gray-700">{tutor.rating.toFixed(1)}</span>
                                        <span className="text-gray-500">(5.0)</span>
                                    </div>

                                    <p className="text-2xl font-bold text-green-700 mb-4">{tutor.price} Birr/hr</p>
                                    
                                    <p className="text-gray-600 mb-6 line-clamp-3">{tutor.bio}</p>
                                    
                                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-colors transform hover:scale-105">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-200">
                        <p className="text-lg text-gray-500">No tutors are currently available. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorList;
