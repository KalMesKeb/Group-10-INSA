// TutorRegistration.js

import React, { useState } from 'react';
import { addTutorApplication } from './dataStore';

const TutorRegistration = () => {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        personalDetails: { name: '', email: '', phone: '', age: '', gender: '' },
        credentials: { education: [{ degree: '', institution: '' }], workExperience: [{ role: '', company: '' }] },
        subjects: [],
        pricing: { hourly: '', packages: [] },
        availability: {},
        bio: '',
        profilePic: null,
        demoVideo: null,
    });

    const handleChange = (e, section, field) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayChange = (e, section, index, field) => {
        const newArray = [...formData.credentials[section]];
        newArray[index] = { ...newArray[index], [field]: e.target.value };
        setFormData(prev => ({
            ...prev,
            credentials: {
                ...prev.credentials,
                [section]: newArray
            }
        }));
    };

    const addToArray = (section, initialValue = {}) => {
        setFormData(prev => ({
            ...prev,
            credentials: {
                ...prev.credentials,
                [section]: [...prev.credentials[section], initialValue]
            }
        }));
    };

    const removeFromArray = (section, index) => {
        const newArray = formData.credentials[section].filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            credentials: {
                ...prev.credentials,
                [section]: newArray
            }
        }));
    };

    const handleFileChange = (e, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.files[0]
        }));
    };

    const handleSubjectChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const newSubjects = checked
                ? [...prev.subjects, value]
                : prev.subjects.filter(subject => subject !== value);
            return { ...prev, subjects: newSubjects };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.demoVideo) {
            alert("Please upload a 1-minute demo video.");
            return;
        }

        const newApplication = {
            id: `app${Math.floor(Math.random() * 1000)}`,
            name: formData.personalDetails.name,
            email: formData.personalDetails.email,
            subjects: formData.subjects,
            status: 'Pending',
            profileData: {
                bio: formData.bio,
                education: formData.credentials.education,
                workExperience: formData.credentials.workExperience,
                pricing: formData.pricing,
                availability: formData.availability,
                profilePic: formData.profilePic ? URL.createObjectURL(formData.profilePic) : 'https://via.placeholder.com/150',
                demoVideo: formData.demoVideo ? URL.createObjectURL(formData.demoVideo) : '',
            },
        };

        addTutorApplication(newApplication);

        setIsSubmitted(true);
        setStep(1);
        setFormData({
            personalDetails: { name: '', email: '', phone: '', age: '', gender: '' },
            credentials: { education: [{ degree: '', institution: '' }], workExperience: [{ role: '', company: '' }] },
            subjects: [],
            pricing: { hourly: '', packages: [] },
            availability: {},
            bio: '',
            profilePic: null,
            demoVideo: null,
        });
    };

    if (isSubmitted) {
        return (
            <div className="max-w-xl mx-auto py-5 px-4 mt-24 text-center bg-white rounded-2xl shadow-2xl border border-gray-200">
                <h2 className="text-s font-extrabold text-green-600 mb-6">Successfully Submitted! </h2>
                <p className="text-s text-gray-700">Thank you for registering. Your profile is now under review by our admin team. We will notify you via email once it has been approved. This may take up to 48 hours.</p>
                <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-1 bg-indigo-600 hover:bg-indigo-700 text-white font-normal py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-50"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    const renderStep = () => {
        const inputStyle = "shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors";
        const labelStyle = "block text-gray-700 text-sm font-bold mb-2";

        switch (step) {
            case 1:
                return (
                    <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-3xl font-bold mb-8 text-indigo-700">1. Personal Details 👤</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelStyle} htmlFor="name">Full Name<span className="text-red-500">*</span></label>
                                <input type="text" id="name" className={inputStyle} value={formData.personalDetails.name} onChange={(e) => handleChange(e, 'personalDetails', 'name')} required />
                            </div>
                            <div>
                                <label className={labelStyle} htmlFor="email">Email<span className="text-red-500">*</span></label>
                                <input type="email" id="email" className={inputStyle} value={formData.personalDetails.email} onChange={(e) => handleChange(e, 'personalDetails', 'email')} required />
                            </div>
                            <div>
                                <label className={labelStyle} htmlFor="phone">Phone Number<span className="text-red-500">*</span></label>
                                <input type="tel" id="phone" className={inputStyle} value={formData.personalDetails.phone} onChange={(e) => handleChange(e, 'personalDetails', 'phone')} required />
                            </div>
                            <div>
                                <label className={labelStyle} htmlFor="age">Age (Optional)</label>
                                <input type="number" id="age" className={inputStyle} value={formData.personalDetails.age} onChange={(e) => handleChange(e, 'personalDetails', 'age')} />
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelStyle} htmlFor="gender">Gender (Optional)</label>
                                <select id="gender" className={inputStyle} value={formData.personalDetails.gender} onChange={(e) => handleChange(e, 'personalDetails', 'gender')}>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end mt-10">
                            <button type="button" onClick={() => {
                                if (formData.personalDetails.name && formData.personalDetails.email && formData.personalDetails.phone) {
                                    setStep(2);
                                } else {
                                    alert('Please fill out all required fields.');
                                }
                            }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">Next</button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-3xl font-bold mb-8 text-indigo-700">2. Credentials & Experience 📚</h3>

                        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-xl font-semibold mb-4 text-gray-800">Educational Credentials<span className="text-red-500">*</span></h4>
                            {formData.credentials.education.map((edu, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className={labelStyle}>Degree/Certificate</label>
                                        <input type="text" className={inputStyle} value={edu.degree} onChange={(e) => handleArrayChange(e, 'education', index, 'degree')} required />
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Institution</label>
                                        <input type="text" className={inputStyle} value={edu.institution} onChange={(e) => handleArrayChange(e, 'education', index, 'institution')} required />
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <button type="button" onClick={() => removeFromArray('education', index)} className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">Remove</button>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={() => addToArray('education', { degree: '', institution: '' })} className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium mt-4 transition-transform transform hover:scale-105">Add Education</button>
                        </div>

                        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-xl font-semibold mb-4 text-gray-800">Work Experience (Optional)</h4>
                            {formData.credentials.workExperience.map((work, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className={labelStyle}>Role/Position</label>
                                        <input type="text" className={inputStyle} value={work.role} onChange={(e) => handleArrayChange(e, 'workExperience', index, 'role')} />
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Company/Institution</label>
                                        <input type="text" className={inputStyle} value={work.company} onChange={(e) => handleArrayChange(e, 'workExperience', index, 'company')} />
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <button type="button" onClick={() => removeFromArray('workExperience', index)} className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">Remove</button>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={() => addToArray('workExperience', { role: '', company: '' })} className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium mt-4 transition-transform transform hover:scale-105">Add Work Experience</button>
                        </div>

                        <div className="flex justify-between mt-10">
                            <button type="button" onClick={() => setStep(1)} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">Previous</button>
                            <button type="button" onClick={() => setStep(3)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">Next</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-3xl font-bold mb-8 text-indigo-700">3. Subjects, Pricing & Availability 🗓️</h3>

                        <div className="mb-8">
                            <label className={labelStyle}>Subjects You Teach<span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art', 'Music', 'Languages (Specify)'].map((subject) => (
                                    <label key={subject} className="inline-flex items-center text-gray-700">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                                            value={subject}
                                            checked={formData.subjects.includes(subject)}
                                            onChange={handleSubjectChange}
                                        />
                                        <span className="ml-2 font-medium">{subject}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className={labelStyle} htmlFor="hourlyPrice">Hourly Price (Birr)<span className="text-red-500">*</span></label>
                            <input type="number" id="hourlyPrice" className={inputStyle} value={formData.pricing.hourly} onChange={(e) => handleChange(e, 'pricing', 'hourly')} min="0" step="0.01" required />
                        </div>

                        <div className="mb-8">
                            <label className={labelStyle}>Availability (Example - you'd build a more interactive calendar)<span className="text-red-500">*</span></label>
                            <textarea className={inputStyle} rows="4" placeholder="e.g., Mon-Fri 4 PM - 8 PM, Sat 10 AM - 2 PM" value={formData.availability.text || ''} onChange={(e) => setFormData(prev => ({ ...prev, availability: { text: e.target.value } }))} required></textarea>
                        </div>

                        <div className="flex justify-between mt-10">
                            <button type="button" onClick={() => setStep(2)} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">Previous</button>
                            <button type="button" onClick={() => {
                                if (formData.subjects.length > 0 && formData.pricing.hourly && formData.availability.text) {
                                    setStep(4);
                                } else {
                                    alert('Please fill out all required fields.');
                                }
                            }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">Next</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-3xl font-bold mb-8 text-indigo-700">4. Bio & Profile Picture ✨</h3>

                        <div className="mb-8">
                            <label className={labelStyle} htmlFor="bio">Short Bio / Teaching Philosophy<span className="text-red-500">*</span></label>
                            <textarea id="bio" className={inputStyle} rows="6" placeholder="Tell students about yourself, your teaching style, and what you offer." value={formData.bio} onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))} required></textarea>
                        </div>

                        <div className="mb-8">
                            <label className={labelStyle} htmlFor="profilePic">Profile Picture (Optional)</label>
                            <input
                                type="file"
                                id="profilePic"
                                accept="image/*"
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                                onChange={(e) => handleFileChange(e, 'profilePic')}
                            />
                            {formData.profilePic && (
                                <p className="mt-2 text-sm text-gray-500">Selected file: {formData.profilePic.name}</p>
                            )}
                        </div>

                        <div className="flex justify-between mt-10">
                            <button type="button" onClick={() => setStep(3)} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">Previous</button>
                            <button type="button" onClick={() => setStep(5)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">Next</button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-3xl font-bold mb-8 text-indigo-700">5. Demo Video 🎬</h3>
                        <div className="mb-8">
                            <label className={labelStyle} htmlFor="demoVideo">
                                1-Minute Self-Introduction Video<span className="text-red-500">*</span>
                                <p className="text-gray-500 font-normal mt-1 text-sm">Please upload a short video (max 1 minute) introducing yourself, your teaching style, and what you offer. This is required for your profile review.</p>
                            </label>
                            <input
                                type="file"
                                id="demoVideo"
                                accept="video/mp4,video/mov"
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                                onChange={(e) => handleFileChange(e, 'demoVideo')}
                                required
                            />
                            {formData.demoVideo && (
                                <p className="mt-2 text-sm text-gray-500">Selected file: {formData.demoVideo.name}</p>
                            )}
                        </div>
                        <div className="flex justify-between mt-10">
                            <button type="button" onClick={() => setStep(4)} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">Previous</button>
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-transform transform hover:scale-105">Submit Registration</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 mt-24">
            <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-12">Become a Tutor Today!</h2>
            <form onSubmit={handleSubmit}>
                {renderStep()}
            </form>
        </div>
    );
};

export default TutorRegistration;