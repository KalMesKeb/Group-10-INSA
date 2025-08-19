import React, { useState } from 'react';
import { disputeAPI } from '../utils/api';

const  DisputeReport = async () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        issue: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [charCount, setCharCount] = useState(0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        // Update character count for issue field
        if (name === 'issue') {
            setCharCount(value.length);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!formData.name || !formData.email || !formData.issue) {
            // Using a custom message box instead of alert()
            // In a real application, you'd use a modal or a styled notification
            console.log('Please fill out all fields.');
            return;
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        
        if (!formData.issue.trim()) {
            newErrors.issue = 'Issue description is required';
        } else if (formData.issue.length < 20) {
            newErrors.issue = 'Please provide more details (at least 20 characters)';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

        try {
            // Submit dispute to backend API
            const disputeData = {
                name: formData.name,
                email: formData.email,
                issue: formData.issue
            };

            const response = await disputeAPI.submitDispute(disputeData);
            
            if (response.success) {
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error('Error submitting dispute:', error);
            alert('Failed to submit dispute. Please try again.');
        }
    };

    if (isSubmitted) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6"
            >
                <div className="bg-white p-12 rounded-2xl shadow-xl max-w-xl text-center border-t-4 border-indigo-500 transform transition-all hover:shadow-2xl mt-20">
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <svg className="w-20 h-20 mx-auto text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </motion.div>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Thank you!</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Your case has been submitted. We will contact you after we have reviewed it. This process typically takes up to 48 hours.
                    </p>
                    <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
                        <ul className="text-left text-blue-700 space-y-2 text-sm">
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                                </svg>
                                <span>You'll receive a confirmation email shortly</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                                </svg>
                                <span>Our team will review your case within 24 hours</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                                </svg>
                                <span>We may contact you for additional information</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-6 py-20"
        >
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border-t-4 border-green-500 transform transition-all hover:shadow-2xl mt-20">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Report a Dispute</h2>
                    <p className="text-center text-gray-600 mb-8">
                        Please provide the details of your issue below. Our team will review your case as soon as possible.
                    </p>
                </motion.div>
                
                <form onSubmit={handleSubmit}>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter your full name"
                        />
                        {errors.name && (
                            <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1"
                            >
                                {errors.name}
                            </motion.p>
                        )}
                    </motion.div>
                    
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                    >
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Your Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter your email address"
                        />
                        {errors.email && (
                            <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1"
                            >
                                {errors.email}
                            </motion.p>
                        )}
                    </motion.div>
                    
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-6"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="issue" className="block text-gray-700 text-sm font-bold">
                                Explain the problem <span className="text-red-500">*</span>
                            </label>
                            <span className={`text-xs ${charCount < 20 ? 'text-red-500' : 'text-gray-500'}`}>
                                {charCount}/500
                            </span>
                        </div>
                        <textarea
                            id="issue"
                            name="issue"
                            value={formData.issue}
                            onChange={handleInputChange}
                            rows="6"
                            maxLength="500"
                            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.issue ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Please provide a detailed explanation of the issue (minimum 20 characters)."
                        ></textarea>
                        {errors.issue && (
                            <motion.p 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1"
                            >
                                {errors.issue}
                            </motion.p>
                        )}
                    </motion.div>
                    
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center"
                    >
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center ${isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all transform hover:scale-105`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Submit Case'
                            )}
                        </button>
                    </motion.div>
                </form>
                
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-8 text-center text-sm text-gray-500"
                >
                    <p>Need immediate assistance? <a href="#" className="text-indigo-600 hover:underline">Contact our support team</a></p>
                </motion.div>
            </div>
        </motion.div>
    );
;

export default DisputeReport;