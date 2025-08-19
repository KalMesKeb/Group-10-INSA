import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; // Import the new Sidebar component
import { applicationAPI, userAPI, disputeAPI, sessionAPI } from '../utils/api';
import { FaExclamationTriangle, FaRegCalendarCheck, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('bookedSessions');
    const [tutorApplicationsState, setTutorApplicationsState] = useState([]);
    const [disputesState, setDisputesState] = useState([]);
    const [userAccountsState, setUserAccountsState] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [bookedSessionsState, setBookedSessionsState] = useState([]);

    useEffect(() => {
        const loadAdminData = async () => {
            try {
                // Load tutor applications
                const applicationsResponse = await applicationAPI.getAllApplications();
                if (applicationsResponse.success) {
                    setTutorApplicationsState(applicationsResponse.applications);
                }

                // Load user accounts
                const usersResponse = await userAPI.getAllUsers();
                if (usersResponse.success) {
                    setUserAccountsState(usersResponse.users);
                }

                // Load disputes
                const disputesResponse = await disputeAPI.getAllDisputes();
                if (disputesResponse.success) {
                    setDisputesState(disputesResponse.disputes);
                }

                // Load booked sessions
                const sessionsResponse = await sessionAPI.getUserSessions();
                if (sessionsResponse.success) {
                    setBookedSessionsState(sessionsResponse.sessions);
                }
            } catch (error) {
                console.error('Error loading admin data:', error);
            }
        };

        loadAdminData();
    }, []);

    const handleApprove = async (id) => {
        try {
            await applicationAPI.updateApplicationStatus(id, 'approved');
            setTutorApplicationsState(prev => prev.filter(app => app.id !== id));
            setSelectedApplication(null);
        } catch (error) {
            console.error('Error approving application:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await applicationAPI.updateApplicationStatus(id, 'rejected');
            setTutorApplicationsState(prev => prev.filter(app => app.id !== id));
            setSelectedApplication(null);
        } catch (error) {
            console.error('Error rejecting application:', error);
        }
    };

    const handleResolveDispute = async (id) => {
        try {
            await disputeAPI.updateDisputeStatus(id, 'resolved');
            setDisputesState(prev => prev.filter(dispute => dispute.id !== id));
        } catch (error) {
            console.error('Error resolving dispute:', error);
        }
    };

    const handleSuspendAccount = async (id) => {
        try {
            await userAPI.updateUserStatus(id, 'suspended');
            setUserAccountsState(prev => prev.map(user => 
                user.id === id ? { ...user, status: 'Suspended' } : user
            ));
        } catch (error) {
            console.error('Error suspending account:', error);
        }
    };

    const handleUnsuspendAccount = async (id) => {
        try {
            await userAPI.updateUserStatus(id, 'active');
            setUserAccountsState(prev => prev.map(user => 
                user.id === id ? { ...user, status: 'Active' } : user
            ));
        } catch (error) {
            console.error('Error unsuspending account:', error);
        }
    };

    const sectionTitleStyle = "text-3xl font-bold text-gray-800 mb-6 border-b pb-2";
    const listContainerStyle = "bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8";
    const itemStyle = "flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0";

    const renderContent = () => {
        switch (activeSection) {
            case 'bookedSessions':
                return (
                    <div className={listContainerStyle}>
                        <h2 className={sectionTitleStyle}>Booked Sessions ({bookedSessionsState.length})</h2>
                        {bookedSessionsState.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {bookedSessionsState.map((session, index) => (
                                    <li key={index} className={itemStyle}>
                                        <div>
                                            <p className="font-semibold text-lg">Session with {session.tutorName}</p>
                                            <p className="text-sm text-gray-600">Student: {session.studentName}</p>
                                            <p className="text-sm text-gray-500">Subject: {session.subject}</p>
                                            <p className="text-sm text-gray-500">Date: {session.date} at {session.time}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No sessions have been booked yet.</p>
                        )}
                    </div>
                );
            case 'tutorApplications':
                return (
                    <div className={listContainerStyle}>
                        <h2 className={sectionTitleStyle}>Tutor Applications ({tutorApplicationsState.length})</h2>
                        {selectedApplication ? (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-2xl font-bold mb-4">{selectedApplication.name}'s Profile</h3>
                                <div className="flex items-start mb-6 space-x-6">
                                    <img src={selectedApplication.profileData.profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-6 md:mb-0 md:mr-8 border-4 border-indigo-400" />
                                    <div>
                                        <p className="font-semibold text-lg">{selectedApplication.email}</p>
                                        <p className="text-sm text-gray-600">Subjects: {selectedApplication.subjects.join(', ')}</p>
                                        <p className="text-sm text-gray-600">Hourly Rate: {selectedApplication.profileData.pricing.hourly} Birr</p>
                                    </div>
                                </div>

                                <h4 className="text-xl font-semibold mb-2">Bio:</h4>
                                <p className="text-gray-700 mb-4">{selectedApplication.profileData.bio}</p>

                                <h4 className="text-xl font-semibold mb-2">Demo Video:</h4>
                                {selectedApplication.profileData.demoVideo ? (
                                    <video controls className="w-full h-auto rounded-lg mb-4">
                                        <source src={selectedApplication.profileData.demoVideo} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <p className="text-gray-500">No demo video uploaded.</p>
                                )}

                                <div className="mt-6 flex space-x-4">
                                    <button onClick={() => handleApprove(selectedApplication.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-transform transform hover:scale-105">Approve</button>
                                    <button onClick={() => handleReject(selectedApplication.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-transform transform hover:scale-105">Reject</button>
                                    <button onClick={() => setSelectedApplication(null)} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full transition-transform transform hover:scale-105">Back</button>
                                </div>
                            </div>
                        ) : tutorApplicationsState.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {tutorApplicationsState.map(app => (
                                    <li key={app.id} className={itemStyle}>
                                        <div>
                                            <p className="font-semibold text-lg">{app.name}</p>
                                            <p className="text-sm text-gray-600">{app.email}</p>
                                            <p className="text-sm text-gray-500">Subjects: {app.subjects.join(', ')}</p>
                                        </div>
                                        <div className="space-x-4">
                                            <button onClick={() => setSelectedApplication(app)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105">View Profile</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No new tutor applications at this time.</p>
                        )}
                    </div>
                );
            case 'disputes':
                return (
                    <div className={listContainerStyle}>
                        <h2 className={sectionTitleStyle}>Disputes ({disputesState.length})</h2>
                        {disputesState.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {disputesState.map(dispute => (
                                    <li key={dispute.id} className={itemStyle}>
                                        <div>
                                            <p className="font-semibold text-lg">Dispute #{dispute.id}</p>
                                            <p className="text-sm text-gray-600"><strong>Tutor:</strong> {dispute.tutor}, <strong>Student:</strong> {dispute.student}</p>
                                            <p className="text-sm text-gray-500">Issue: {dispute.issue}</p>
                                        </div>
                                        <button onClick={() => handleResolveDispute(dispute.id)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105">Resolve</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No open disputes at this time.</p>
                        )}
                    </div>
                );
            case 'userAccounts':
                return (
                    <div className={listContainerStyle}>
                        <h2 className={sectionTitleStyle}>User Accounts ({userAccountsState.length})</h2>
                        <ul className="divide-y divide-gray-200">
                            {userAccountsState.map(user => (
                                <li key={user.id} className={itemStyle}>
                                    <div>
                                        <p className="font-semibold text-lg">{user.name}</p>
                                        <p className="text-sm text-gray-600">Role: {user.role}</p>
                                        <p className={`text-sm font-semibold ${user.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                                            Status: {user.status}
                                        </p>
                                    </div>
                                    <div>
                                        {user.status === 'Active' ? (
                                            <button onClick={() => handleSuspendAccount(user.id)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105">Suspend</button>
                                        ) : (
                                            <button onClick={() => handleUnsuspendAccount(user.id)} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105">Unsuspend</button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex bg-gray-100 min-h-screen mt-30">
            <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            <div className="flex-1 p-10">
               
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;