import React from 'react';
import { FaUsers, FaChalkboardTeacher, FaRegCalendarCheck, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ activeSection, onSectionChange }) => {
    const sidebarItems = [
        { name: 'Booked Sessions', icon: <FaRegCalendarCheck />, id: 'bookedSessions' },
        { name: 'Tutor Applications', icon: <FaChalkboardTeacher />, id: 'tutorApplications' },
        { name: 'User Accounts', icon: <FaUsers />, id: 'userAccounts' },
        { name: 'Disputes', icon: <FaExclamationTriangle />, id: 'disputes' },
    ];

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col">
            {/* Logo or Dashboard Title */}
            <div className="flex items-center justify-center p-4 mb-6">
                <h1 className="text-2xl font-bold text-indigo-400">Admin Panel</h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow">
                <ul>
                    {sidebarItems.map((item) => (
                        <li key={item.id} className="mb-2">
                            <button
                                onClick={() => onSectionChange(item.id)}
                                className={`flex items-center w-full py-3 px-4 rounded-lg transition duration-200 ${
                                    activeSection === item.id
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <span className="mr-3 text-xl">{item.icon}</span>
                                <span className="text-sm font-medium">{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="mt-auto pt-4 border-t border-gray-700">
                <button
                    onClick={() => console.log('Logout')} // Replace with actual logout logic
                    className="flex items-center w-full py-3 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition duration-200"
                >
                    <span className="mr-3 text-xl"><FaSignOutAlt /></span>
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;