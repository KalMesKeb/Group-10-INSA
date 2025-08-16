// src/components/TutorProfile.jsx

import React from 'react';
import { Mail, Phone, Book, GraduationCap, Briefcase, DollarSign, Clock, Video, Info } from 'lucide-react';

// The TutorProfile component now expects to receive the profileData object as a prop.
const TutorProfile = ({ profileData }) => {
    // CRITICAL FIX: Check if profileData exists. If not, show a message.
    // This prevents the "Cannot read properties of undefined" error when the page first loads.
    if (!profileData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700 p-8">
                <div className="bg-white rounded-xl shadow-xl p-10 text-center">
                    <p className="text-xl font-medium mb-4">No tutor profile data available.</p>
                    <p className="text-sm">Please complete the registration form to view your profile.</p>
                </div>
            </div>
        );
    }

    const {
        bio,
        education,
        workExperience,
        subjects,
        pricing,
        availability,
        profilePic,
        demoVideo
    } = profileData;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 mt-20">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
                <div className="relative h-64 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center p-6">
                    <img
                        src={profilePic || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        className="w-48 h-48 rounded-full border-8 border-white shadow-lg object-cover ring-2 ring-purple-300"
                    />
                </div>
                <div className="p-10 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-4 mb-2">
                        {profileData.name}
                    </h1>
                    <p className="text-lg text-indigo-600 font-semibold mb-6">
                        Tutor Profile
                    </p>

                    <div className="text-gray-600 mt-8 mb-10 text-left space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <Info className="mr-3 text-indigo-500" size={24} /> Bio
                        </h2>
                        <p className="text-lg leading-relaxed italic">"{bio || 'No bio provided.'}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Contact Information */}
                        <div className="bg-gray-100 p-6 rounded-2xl shadow-inner border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Mail className="mr-2 text-blue-500" size={20} /> Contact
                            </h3>
                            <p className="text-gray-700 flex items-center mb-2"><Mail className="mr-2 text-gray-400" size={16} />{profileData.email}</p>
                            <p className="text-gray-700 flex items-center"><Phone className="mr-2 text-gray-400" size={16} />{profileData.phone}</p>
                        </div>

                        {/* Subjects */}
                        <div className="bg-gray-100 p-6 rounded-2xl shadow-inner border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Book className="mr-2 text-green-500" size={20} /> Subjects
                            </h3>
                            {/* CRITICAL FIX: Add a check for subjects array and handle undefined gracefully */}
                            <p className="text-gray-700">{subjects && subjects.length > 0 ? subjects.join(', ') : 'No subjects listed.'}</p>
                        </div>

                        {/* Pricing & Availability */}
                        <div className="bg-gray-100 p-6 rounded-2xl shadow-inner border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <DollarSign className="mr-2 text-yellow-500" size={20} /> Rates & Availability
                            </h3>
                            <p className="text-gray-700 flex items-center mb-2"><DollarSign className="mr-2 text-gray-400" size={16} />Hourly: {pricing?.hourly ? `${pricing.hourly} Birr` : 'N/A'}</p>
                            <p className="text-gray-700 flex items-center"><Clock className="mr-2 text-gray-400" size={16} />{availability?.text || 'Not specified'}</p>
                        </div>

                    </div>

                    {/* Education and Experience Sections */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-100 p-8 rounded-2xl shadow-lg border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <GraduationCap className="mr-3 text-red-500" size={24} /> Education
                            </h3>
                            {education?.map((edu, index) => (
                                <div key={index} className="mb-4 last:mb-0">
                                    <h4 className="font-semibold text-lg text-gray-900">{edu.degree}</h4>
                                    <p className="text-gray-600 italic">{edu.institution}</p>
                                </div>
                            )) || <p className="text-gray-600">No education listed.</p>}
                        </div>

                        <div className="bg-gray-100 p-8 rounded-2xl shadow-lg border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <Briefcase className="mr-3 text-purple-500" size={24} /> Work Experience
                            </h3>
                            {workExperience?.map((work, index) => (
                                <div key={index} className="mb-4 last:mb-0">
                                    <h4 className="font-semibold text-lg text-gray-900">{work.role}</h4>
                                    <p className="text-gray-600 italic">{work.company}</p>
                                </div>
                            )) || <p className="text-gray-600">No work experience listed.</p>}
                        </div>
                    </div>

                    {/* Demo Video Section */}
                    <div className="mt-12 bg-gray-100 p-8 rounded-2xl shadow-lg border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <Video className="mr-3 text-pink-500" size={24} /> Demo Video
                        </h3>
                        {demoVideo ? (
                            <video controls src={demoVideo} className="w-full rounded-xl shadow-md border-4 border-white"></video>
                        ) : (
                            <p className="text-gray-600 italic">No demo video uploaded.</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TutorProfile;
