// src/components/TutorProfile.jsx
import React, { useState } from 'react';
import { Mail, Phone, Book, GraduationCap, Briefcase, DollarSign, Clock, Video, Info, Star, Award, User, MessageSquare, Bookmark, Share2 } from 'lucide-react';

const TutorProfile = ({ profileData }) => {
    const [isContactExpanded, setIsContactExpanded] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    if (!profileData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">
                    <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="text-emerald-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Profile Not Found</h2>
                    <p className="text-gray-600 mb-6">Please complete your registration to view your tutor profile.</p>
                    <button 
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={() => window.location.href = '/register'}
                    >
                        Complete Registration
                    </button>
                </div>
            </div>
        );
    }

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
        demoVideo = null,
        rating = 4.8,
        reviews = 42
    } = profileData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
            <div className="max-w-6xl mx-auto">
                {/* Profile Header */}
                <div className="relative bg-gradient-to-r from-emerald-600 to-teal-700 rounded-t-3xl shadow-2xl overflow-hidden h-80 flex items-end">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="relative w-full px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="relative -mt-20">
                            <img
                                src={profilePic}
                                alt="Profile"
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl object-cover"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-md">
                                <Star className="text-white" size={20} fill="currentColor" />
                            </div>
                        </div>
                        <div className="text-white flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                            <Star className="text-yellow-300 mr-1" size={16} fill="currentColor" />
                                            <span className="font-medium">{rating} ({reviews} reviews)</span>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                                            <span className="font-medium">Certified Tutor</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsBookmarked(!isBookmarked)}
                                        className={`p-2 rounded-full ${isBookmarked ? 'bg-yellow-400 text-white' : 'bg-white/20 text-white'}`}
                                    >
                                        <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                                    </button>
                                    <button className="p-2 rounded-full bg-white/20 text-white">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-4">
                                <button 
                                    onClick={() => setIsContactExpanded(!isContactExpanded)}
                                    className="bg-white text-emerald-700 px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-emerald-50 transition-colors"
                                >
                                    <MessageSquare size={18} />
                                    {isContactExpanded ? 'Hide Contact' : 'Contact Tutor'}
                                </button>
                                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all">
                                    Book Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info Dropdown */}
                {isContactExpanded && (
                    <div className="bg-white shadow-lg rounded-b-xl px-6 py-4 -mt-2 relative z-20 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <Mail className="text-emerald-600 mr-3" size={18} />
                                <a href={`mailto:${email}`} className="text-emerald-700 hover:underline">{email}</a>
                            </div>
                            <div className="flex items-center">
                                <Phone className="text-emerald-600 mr-3" size={18} />
                                <a href={`tel:${phone}`} className="text-gray-700">{phone}</a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-white rounded-b-3xl shadow-xl p-8 md:p-10 -mt-6 relative z-10">
                    {/* Bio Section */}
                    <div className="mb-12">
                        <div className="flex items-center mb-6">
                            <div className="bg-emerald-100 p-2 rounded-full mr-4">
                                <Info className="text-emerald-600" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed pl-14 border-l-4 border-emerald-100">
                            {bio}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Subjects Card */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-4">
                                <div className="bg-emerald-100 p-2 rounded-full mr-3">
                                    <Book className="text-emerald-600" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Subjects & Courses</h3>
                            </div>
                            <div className="pl-11">
                                {subjects.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {subjects.map((subject, index) => (
                                            <span 
                                                key={index} 
                                                className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-emerald-200 transition-colors"
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
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
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

                        {/* Teaching Style Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-2 rounded-full mr-3">
                                    <GraduationCap className="text-blue-600" size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Teaching Approach</h3>
                            </div>
                            <div className="pl-11">
                                <p className="text-gray-700 mb-2">Interactive and student-centered learning</p>
                                <div className="flex flex-wrap gap-1">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Visual Aids</span>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Real-world Examples</span>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Practice Exercises</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Education & Experience */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Education */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-6">
                                <div className="bg-emerald-100 p-2 rounded-full mr-4">
                                    <GraduationCap className="text-emerald-600" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                            </div>
                            {education.length > 0 ? (
                                <div className="space-y-6 pl-14">
                                    {education.map((edu, index) => (
                                        <div key={index} className="relative group">
                                            <div className="absolute -left-7 top-1 w-4 h-4 bg-emerald-400 rounded-full border-4 border-white group-hover:bg-emerald-600 transition-colors"></div>
                                            <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 group-hover:border-emerald-200 transition-colors">
                                                <h3 className="font-bold text-lg text-gray-800 mb-1">{edu.degree}</h3>
                                                <p className="text-gray-600">{edu.institution}</p>
                                                {edu.year && <p className="text-sm text-emerald-600 mt-1">{edu.year}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic pl-14">No education information provided</p>
                            )}
                        </div>

                        {/* Experience */}
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 shadow-sm border border-teal-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-6">
                                <div className="bg-teal-100 p-2 rounded-full mr-4">
                                    <Briefcase className="text-teal-600" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
                            </div>
                            {workExperience.length > 0 ? (
                                <div className="space-y-6 pl-14">
                                    {workExperience.map((work, index) => (
                                        <div key={index} className="relative group">
                                            <div className="absolute -left-7 top-1 w-4 h-4 bg-teal-400 rounded-full border-4 border-white group-hover:bg-teal-600 transition-colors"></div>
                                            <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 group-hover:border-teal-200 transition-colors">
                                                <h3 className="font-bold text-lg text-gray-800 mb-1">{work.role}</h3>
                                                <p className="text-gray-600">{work.company}</p>
                                                {work.duration && <p className="text-sm text-teal-600 mt-1">{work.duration}</p>}
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
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-sm border border-emerald-100 mb-12">
                        <div className="flex items-center mb-6">
                            <div className="bg-emerald-100 p-2 rounded-full mr-4">
                                <Video className="text-emerald-600" size={24} />
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
                                        poster={profilePic}
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

                    {/* Call to Action */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-center text-white shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">Ready to start learning with {name.split(' ')[0]}?</h3>
                        <p className="mb-6 text-emerald-100 max-w-2xl mx-auto">Book your first session today and experience personalized tutoring tailored to your learning style.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="bg-white text-emerald-700 px-8 py-3 rounded-full font-bold shadow-md hover:bg-emerald-50 transition-all">
                                Book a Session
                            </button>
                            <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-full font-bold border border-white/30 transition-all">
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorProfile;