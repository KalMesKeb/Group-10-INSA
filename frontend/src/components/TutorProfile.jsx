// src/components/TutorProfile.jsx
import React from 'react';
import { Mail, Phone, Book, GraduationCap, Briefcase, DollarSign, Clock, Video, Info, Star, Award, User } from 'lucide-react';

const TutorProfile = ({ profileData }) => {
    // Handle missing profile data
    if (!profileData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">
                    <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="text-indigo-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Profile Not Found</h2>
                    <p className="text-gray-600 mb-6">Please complete your registration to view your tutor profile.</p>
                    <button 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={() => window.location.href = '/register'}
                    >
                        Complete Registration
                    </button>
                </div>
            </div>
        );
    }

    // Destructure with fallbacks for all properties
    const {
        name = 'Tutor Name',
        email = 'No email provided',
        phone = 'No phone provided',
        bio = 'No bio provided',
        education = [],
        workExperience = [],
        subjects = [],
        pricing = { hourly: 'N/A' },
        availability = { text: 'Not specified' },
        profilePic = 'https://via.placeholder.com/150',
        demoVideo = null
    } = profileData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-6xl mx-auto">
                {/* Profile Header */}
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 rounded-t-3xl shadow-2xl overflow-hidden h-72 flex items-end">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="relative w-full px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="relative -mt-16">
                            <img
                                src={profilePic}
                                alt="Profile"
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl object-cover"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-md">
                                <Star className="text-white" size={20} fill="currentColor" />
                            </div>
                        </div>
                        <div className="text-white">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 w-fit">
                                <Award className="text-yellow-300" size={18} />
                                <span className="font-medium">Certified Tutor</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-b-3xl shadow-xl p-8 md:p-10 -mt-6 relative z-10">
                    {/* Bio Section */}
                    <div className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="bg-indigo-100 p-2 rounded-full mr-4">
                                <Info className="text-indigo-600" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed pl-14 border-l-4 border-indigo-100 italic">
                            "{bio}"
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Contact Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm border border-blue-100">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                    <Mail className="text-blue-600" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Contact</h3>
                            </div>
                            <div className="space-y-3 pl-11">
                                <div className="flex items-center">
                                    <Mail className="text-gray-500 mr-3" size={18} />
                                    <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="text-gray-500 mr-3" size={18} />
                                    <a href={`tel:${phone}`} className="text-gray-700">{phone}</a>
                                </div>
                            </div>
                        </div>

                        {/* Subjects Card */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-sm border border-green-100">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                    <Book className="text-green-600" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Subjects</h3>
                            </div>
                            <div className="pl-11">
                                {subjects.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {subjects.map((subject, index) => (
                                            <span 
                                                key={index} 
                                                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No subjects listed</p>
                                )}
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 shadow-sm border border-amber-100">
                            <div className="flex items-center mb-4">
                                <div className="bg-amber-100 p-2 rounded-full mr-3">
                                    <DollarSign className="text-amber-600" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Rates & Availability</h3>
                            </div>
                            <div className="space-y-3 pl-11">
                                <div className="flex items-center">
                                    <DollarSign className="text-gray-500 mr-3" size={18} />
                                    <span className="text-gray-700 font-medium">{pricing.hourly} Birr/hour</span>
                                </div>
                                <div className="flex items-start">
                                    <Clock className="text-gray-500 mr-3 mt-1" size={18} />
                                    <span className="text-gray-700">{availability.text}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Education & Experience */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Education */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 shadow-sm border border-red-100">
                            <div className="flex items-center mb-6">
                                <div className="bg-red-100 p-2 rounded-full mr-4">
                                    <GraduationCap className="text-red-600" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                            </div>
                            {education.length > 0 ? (
                                <div className="space-y-6 pl-14">
                                    {education.map((edu, index) => (
                                        <div key={index} className="relative">
                                            <div className="absolute -left-7 top-1 w-4 h-4 bg-red-400 rounded-full border-4 border-white"></div>
                                            <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100">
                                                <h3 className="font-bold text-lg text-gray-800 mb-1">{edu.degree}</h3>
                                                <p className="text-gray-600">{edu.institution}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic pl-14">No education information provided</p>
                            )}
                        </div>

                        {/* Experience */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-sm border border-purple-100">
                            <div className="flex items-center mb-6">
                                <div className="bg-purple-100 p-2 rounded-full mr-4">
                                    <Briefcase className="text-purple-600" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
                            </div>
                            {workExperience.length > 0 ? (
                                <div className="space-y-6 pl-14">
                                    {workExperience.map((work, index) => (
                                        <div key={index} className="relative">
                                            <div className="absolute -left-7 top-1 w-4 h-4 bg-purple-400 rounded-full border-4 border-white"></div>
                                            <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100">
                                                <h3 className="font-bold text-lg text-gray-800 mb-1">{work.role}</h3>
                                                <p className="text-gray-600">{work.company}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic pl-14">No work experience provided</p>
                            )}
                        </div>
                    </div>

                    {/* Demo Video */}
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 shadow-sm border border-pink-100">
                        <div className="flex items-center mb-6">
                            <div className="bg-pink-100 p-2 rounded-full mr-4">
                                <Video className="text-pink-600" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Introduction Video</h2>
                        </div>
                        {demoVideo ? (
                            <div className="pl-14">
                                <div className="aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden shadow-lg">
                                    <video 
                                        controls 
                                        src={demoVideo} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-xl text-center pl-14">
                                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Video className="text-gray-400" size={24} />
                                </div>
                                <p className="text-gray-500">No demo video available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorProfile;