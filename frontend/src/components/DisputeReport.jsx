import React, { useState } from 'react';
import { addDispute } from './dataStore';

const DisputeReport = () => {
    // State to manage form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        issue: ''
    });

    // State to manage the submitted state
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple validation
        if (!formData.name || !formData.email || !formData.issue) {
            // Using a custom message box instead of alert()
            // In a real application, you'd use a modal or a styled notification
            console.log('Please fill out all fields.');
            return;
        }

        // Create a new dispute object
        const newDispute = {
            id: `dispute-${Date.now()}`,
            tutor: formData.name, // Assuming the name is the reporter's name for simplicity
            student: formData.name,
            issue: formData.issue,
            status: 'Open'
        };

        // Add the dispute to the data store
        addDispute(newDispute);

        // Update state to show the thank you message
        setIsSubmitted(true);
    };

    // Render the thank you message if the form has been submitted
    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
                <div className="bg-white p-12 rounded-2xl shadow-xl max-w-xl text-center border-t-4 border-indigo-500">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Thank you!</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Your case has been submitted. We will contact you after we have reviewed it. This process typically takes up to 48 hours.
                    </p>
                    <p className="mt-4 text-gray-500">We appreciate your patience.</p>
                </div>
            </div>
        );
    }

    // Render the form by default
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 mt-20">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border-t-4 border-red-500">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Report a Dispute</h2>
                <p className="text-center text-gray-600 mb-8">
                    Please provide the details of your issue below. Our team will review your case as soon as possible.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Your Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="issue" className="block text-gray-700 text-sm font-bold mb-2">
                            Explain the problem
                        </label>
                        <textarea
                            id="issue"
                            name="issue"
                            value={formData.issue}
                            onChange={handleInputChange}
                            rows="6"
                            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            placeholder="Please provide a detailed explanation of the issue."
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors transform hover:scale-105"
                        >
                            Submit Case
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DisputeReport;
