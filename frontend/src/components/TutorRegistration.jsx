import React, { useState } from 'react';
import { applicationAPI, uploadFile } from '../utils/api';

const TutorRegistration = ({ onRegistrationSuccess }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        personalDetails: { name: '', email: '', phone: '', age: '', gender: '' },
        credentials: { education: [{ degree: '', institution: '' }], workExperience: [{ role: '', company: '' }] },
        subjects: [],
        pricing: { hourly: '', packages: [] },
        availability: { text: '' },
        bio: '',
        profilePic: null,
        demoVideo: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.demoVideo) {
            alert("Please upload a 1-minute demo video.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Upload files if they exist
            let profilePicUrl = '';
            let demoVideoUrl = '';

            if (formData.profilePic) {
                const profilePicResponse = await uploadFile(formData.profilePic, 'profile');
                profilePicUrl = profilePicResponse.url;
            }

            if (formData.demoVideo) {
                const demoVideoResponse = await uploadFile(formData.demoVideo, 'demo');
                demoVideoUrl = demoVideoResponse.url;
            }

            // Prepare application data for backend
            const applicationData = {
                personalDetails: {
                    name: formData.personalDetails.name,
                    email: formData.personalDetails.email,
                    phone: formData.personalDetails.phone,
                    age: formData.personalDetails.age,
                    gender: formData.personalDetails.gender
                },
                credentials: {
                    education: formData.credentials.education,
                    workExperience: formData.credentials.workExperience
                },
                subjects: formData.subjects,
                bio: formData.bio,
                pricing: formData.pricing,
                availability: formData.availability,
                profilePic: profilePicUrl,
                demoVideo: demoVideoUrl
            };

            // Submit to backend API
            const response = await applicationAPI.submitApplication(applicationData);
            
            if (response.success) {
                alert('Application submitted successfully! Please wait for admin approval.');
                // Navigate to profile page with the submitted data
                onRegistrationSuccess(applicationData);
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        }
    };

    const renderStep = () => {
        const inputStyle = "shadow-sm appearance-none border border-gray-200 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300";
        const labelStyle = "block text-gray-700 text-sm font-semibold mb-2";
        const buttonStyle = "font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] active:scale-95";

        switch (step) {
            case 1:
                return (
                    <div className="bg-gradient-to-br from-white to-emerald-50 p-10 rounded-2xl shadow-xl border border-emerald-100">
                        <div className="flex items-center mb-8">
                            <div className="bg-emerald-100 text-emerald-700 rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold">1</div>
                            <h3 className="text-3xl font-bold text-emerald-800">Personal Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className={labelStyle} htmlFor="name">Full Name<span className="text-red-500">*</span></label>
                                    <input type="text" id="name" className={inputStyle} value={formData.personalDetails.name} onChange={(e) => handleChange(e, 'personalDetails', 'name')} required />
                                </div>
                                <div>
                                    <label className={labelStyle} htmlFor="email">Email<span className="text-red-500">*</span></label>
                                    <input type="email" id="email" className={inputStyle} value={formData.personalDetails.email} onChange={(e) => handleChange(e, 'personalDetails', 'email')} required />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelStyle} htmlFor="phone">Phone Number<span className="text-red-500">*</span></label>
                                    <input type="tel" id="phone" className={inputStyle} value={formData.personalDetails.phone} onChange={(e) => handleChange(e, 'personalDetails', 'phone')} required />
                                </div>
                                <div>
                                    <label className={labelStyle} htmlFor="age">Age (Optional)</label>
                                    <input type="number" id="age" className={inputStyle} value={formData.personalDetails.age} onChange={(e) => handleChange(e, 'personalDetails', 'age')} />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelStyle} htmlFor="gender">Gender (Optional)</label>
                                <select id="gender" className={inputStyle} value={formData.personalDetails.gender} onChange={(e) => handleChange(e, 'personalDetails', 'gender')}>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end mt-10">
                            <button 
                                type="button" 
                                onClick={() => {
                                    if (formData.personalDetails.name && formData.personalDetails.email && formData.personalDetails.phone) {
                                        setStep(2);
                                    } else {
                                        alert('Please fill out all required fields.');
                                    }
                                }} 
                                className={`${buttonStyle} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700`}
                            >
                                Next <span className="ml-2">→</span>
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="bg-gradient-to-br from-white to-emerald-50 p-10 rounded-2xl shadow-xl border border-emerald-100">
                        <div className="flex items-center mb-8">
                            <div className="bg-emerald-100 text-emerald-700 rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold">2</div>
                            <h3 className="text-3xl font-bold text-emerald-800">Credentials & Experience</h3>
                        </div>

                        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-4">
                                <h4 className="text-xl font-semibold text-gray-800">Educational Credentials<span className="text-red-500">*</span></h4>
                                <button 
                                    type="button" 
                                    onClick={() => addToArray('education', { degree: '', institution: '' })} 
                                    className="ml-auto bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md"
                                >
                                    + Add Education
                                </button>
                            </div>
                            {formData.credentials.education.map((edu, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <label className={labelStyle}>Degree/Certificate</label>
                                        <input type="text" className={inputStyle} value={edu.degree} onChange={(e) => handleArrayChange(e, 'education', index, 'degree')} required />
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Institution</label>
                                        <input type="text" className={inputStyle} value={edu.institution} onChange={(e) => handleArrayChange(e, 'education', index, 'institution')} required />
                                    </div>
                                    {formData.credentials.education.length > 1 && (
                                        <div className="col-span-2 text-right">
                                            <button 
                                                type="button" 
                                                onClick={() => removeFromArray('education', index)} 
                                                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors flex items-center ml-auto"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center mb-4">
                                <h4 className="text-xl font-semibold text-gray-800">Work Experience (Optional)</h4>
                                <button 
                                    type="button" 
                                    onClick={() => addToArray('workExperience', { role: '', company: '' })} 
                                    className="ml-auto bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md"
                                >
                                    + Add Experience
                                </button>
                            </div>
                            {formData.credentials.workExperience.map((work, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <label className={labelStyle}>Role/Position</label>
                                        <input type="text" className={inputStyle} value={work.role} onChange={(e) => handleArrayChange(e, 'workExperience', index, 'role')} />
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Company/Institution</label>
                                        <input type="text" className={inputStyle} value={work.company} onChange={(e) => handleArrayChange(e, 'workExperience', index, 'company')} />
                                    </div>
                                    {formData.credentials.workExperience.length > 1 && (
                                        <div className="col-span-2 text-right">
                                            <button 
                                                type="button" 
                                                onClick={() => removeFromArray('workExperience', index)} 
                                                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors flex items-center ml-auto"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-10">
                            <button 
                                type="button" 
                                onClick={() => setStep(1)} 
                                className={`${buttonStyle} bg-gray-300 text-gray-700 hover:bg-gray-400`}
                            >
                                ← Previous
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setStep(3)} 
                                className={`${buttonStyle} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700`}
                            >
                                Next <span className="ml-2">→</span>
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-gradient-to-br from-white to-emerald-50 p-10 rounded-2xl shadow-xl border border-emerald-100">
                        <div className="flex items-center mb-8">
                            <div className="bg-emerald-100 text-emerald-700 rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold">3</div>
                            <h3 className="text-3xl font-bold text-emerald-800">Subjects & Availability</h3>
                        </div>

                        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <label className={`${labelStyle} mb-4`}>Subjects You Teach<span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art', 'Music', 'Languages (Specify)'].map((subject) => (
                                    <label 
                                        key={subject} 
                                        className={`inline-flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                                            formData.subjects.includes(subject) 
                                                ? 'bg-emerald-100 border border-emerald-300' 
                                                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-emerald-600 rounded"
                                            value={subject}
                                            checked={formData.subjects.includes(subject)}
                                            onChange={handleSubjectChange}
                                        />
                                        <span className="ml-2 font-medium text-gray-700">{subject}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <label className={labelStyle} htmlFor="hourlyPrice">Hourly Price (Birr)<span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500 font-medium">ETB</span>
                                <input 
                                    type="number" 
                                    id="hourlyPrice" 
                                    className={`${inputStyle} pl-12`} 
                                    value={formData.pricing.hourly} 
                                    onChange={(e) => handleChange(e, 'pricing', 'hourly')} 
                                    min="0" 
                                    step="0.01" 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <label className={labelStyle}>Availability<span className="text-red-500">*</span></label>
                            <textarea 
                                className={`${inputStyle} min-h-[120px]`} 
                                placeholder="e.g., Mon-Fri 4 PM - 8 PM, Sat 10 AM - 2 PM" 
                                value={formData.availability.text || ''} 
                                onChange={(e) => setFormData(prev => ({ ...prev, availability: { text: e.target.value } }))} 
                                required
                            ></textarea>
                            <p className="text-sm text-gray-500 mt-2">Please be as specific as possible about your available hours</p>
                        </div>

                        <div className="flex justify-between mt-10">
                            <button 
                                type="button" 
                                onClick={() => setStep(2)} 
                                className={`${buttonStyle} bg-gray-300 text-gray-700 hover:bg-gray-400`}
                            >
                                ← Previous
                            </button>
                            <button 
                                type="button" 
                                onClick={() => {
                                    if (formData.subjects.length > 0 && formData.pricing.hourly && formData.availability.text) {
                                        setStep(4);
                                    } else {
                                        alert('Please fill out all required fields.');
                                    }
                                }} 
                                className={`${buttonStyle} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700`}
                            >
                                Next <span className="ml-2">→</span>
                            </button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-gradient-to-br from-white to-emerald-50 p-10 rounded-2xl shadow-xl border border-emerald-100">
                        <div className="flex items-center mb-8">
                            <div className="bg-emerald-100 text-emerald-700 rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold">4</div>
                            <h3 className="text-3xl font-bold text-emerald-800">Profile & Introduction</h3>
                        </div>

                        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <label className={labelStyle} htmlFor="bio">Short Bio / Teaching Philosophy<span className="text-red-500">*</span></label>
                            <textarea 
                                id="bio" 
                                className={`${inputStyle} min-h-[180px]`} 
                                placeholder="Tell students about yourself, your teaching style, and what makes you unique..." 
                                value={formData.bio} 
                                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))} 
                                required
                            ></textarea>
                            <p className="text-sm text-gray-500 mt-2">This will be displayed on your public profile (min. 100 characters)</p>
                        </div>

                        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <label className={labelStyle} htmlFor="profilePic">Profile Picture (Optional)</label>
                            <div className="flex items-center">
                                <label className="cursor-pointer">
                                    <div className="flex items-center">
                                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mr-4 overflow-hidden border-2 border-dashed border-gray-300">
                                            {formData.profilePic ? (
                                                <img 
                                                    src={URL.createObjectURL(formData.profilePic)} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <div className="bg-emerald-50 text-emerald-700 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-emerald-100">
                                                {formData.profilePic ? 'Change Photo' : 'Upload Photo'}
                                            </div>
                                            {formData.profilePic && (
                                                <p className="mt-1 text-xs text-gray-500">{formData.profilePic.name}</p>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        id="profilePic"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, 'profilePic')}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-between mt-10">
                            <button 
                                type="button" 
                                onClick={() => setStep(3)} 
                                className={`${buttonStyle} bg-gray-300 text-gray-700 hover:bg-gray-400`}
                            >
                                ← Previous
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setStep(5)} 
                                className={`${buttonStyle} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700`}
                            >
                                Next <span className="ml-2">→</span>
                            </button>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-gradient-to-br from-white to-emerald-50 p-10 rounded-2xl shadow-xl border border-emerald-100">
                        <div className="flex items-center mb-8">
                            <div className="bg-emerald-100 text-emerald-700 rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold">5</div>
                            <h3 className="text-3xl font-bold text-emerald-800">Final Step: Video Introduction</h3>
                        </div>
                        
                        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <label className={labelStyle} htmlFor="demoVideo">
                                1-Minute Self-Introduction Video<span className="text-red-500">*</span>
                            </label>
                            <p className="text-gray-600 mb-4">This short video helps students get to know you before booking sessions.</p>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                                {formData.demoVideo ? (
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-full max-w-md h-48 bg-black rounded-lg overflow-hidden mb-4">
                                            <video 
                                                src={URL.createObjectURL(formData.demoVideo)} 
                                                controls 
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-700 mb-4">{formData.demoVideo.name}</p>
                                        <button 
                                            type="button" 
                                            onClick={() => document.getElementById('demoVideo').click()} 
                                            className="bg-emerald-50 text-emerald-700 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-emerald-100"
                                        >
                                            Change Video
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-600 mb-4">Upload a 1-minute video introducing yourself</p>
                                        <button 
                                            type="button" 
                                            onClick={() => document.getElementById('demoVideo').click()} 
                                            className="bg-emerald-50 text-emerald-700 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-emerald-100"
                                        >
                                            Select Video File
                                        </button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="demoVideo"
                                    accept="video/mp4,video/mov"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, 'demoVideo')}
                                    required
                                />
                            </div>
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Video Tips
                                </h4>
                                <ul className="text-xs text-blue-700 list-disc pl-5 space-y-1">
                                    <li>Keep it under 1 minute</li>
                                    <li>Introduce yourself and your teaching style</li>
                                    <li>Mention your qualifications and experience</li>
                                    <li>Speak clearly and smile!</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-between mt-10">
                            <button 
                                type="button" 
                                onClick={() => setStep(4)} 
                                className={`${buttonStyle} bg-gray-300 text-gray-700 hover:bg-gray-400`}
                            >
                                ← Previous
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`${buttonStyle} bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 flex items-center justify-center ${
                                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Submit Application'
                                )}
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-screen min-h-screen bg-gradient-to-b from-emerald-50 to-white mt-30">
            <div className="max-w-5xl mx-auto py-12 px-4">
                <div className="text-center mb-12">
                   
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Join our platform and share your knowledge with students around the world
                    </p>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-2">
                        {[1, 2, 3, 4, 5].map((stepNumber) => (
                            <div 
                                key={stepNumber} 
                                className={`flex flex-col items-center ${step >= stepNumber ? 'text-emerald-600' : 'text-gray-400'}`}
                            >
                                <div className={`rounded-full w-10 h-10 flex items-center justify-center mb-2 ${
                                    step > stepNumber 
                                        ? 'bg-green-100 text-green-600' 
                                        : step === stepNumber 
                                            ? 'bg-emerald-100 text-emerald-600' 
                                            : 'bg-gray-100'
                                }`}>
                                    {step > stepNumber ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        stepNumber
                                    )}
                                </div>
                                <span className="text-xs font-medium">
                                    {stepNumber === 1 && 'Personal'}
                                    {stepNumber === 2 && 'Credentials'}
                                    {stepNumber === 3 && 'Subjects'}
                                    {stepNumber === 4 && 'Profile'}
                                    {stepNumber === 5 && 'Video'}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-gradient-to-r from-emerald-500 to-green-600 h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${(step / 5) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mb-20">
                    {renderStep()}
                </form>
            </div>
        </div>
    );
};

export default TutorRegistration;