import React, { useState, useEffect } from 'react';
import { tutorApplications, userAccounts, disputes, approveTutor, rejectTutor, bookedSessions } from './dataStore';

const AdminDashboard = () => {
    const [tutorApplicationsState, setTutorApplicationsState] = useState(tutorApplications);
    const [disputesState, setDisputesState] = useState(disputes);
    const [userAccountsState, setUserAccountsState] = useState(userAccounts);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [bookedSessionsState, setBookedSessionsState] = useState(bookedSessions);

    useEffect(() => {
        setTutorApplicationsState([...tutorApplications]);
        setUserAccountsState([...userAccounts]);
        setDisputesState([...disputes]);
        setBookedSessionsState([...bookedSessions]);
    }, [tutorApplications, userAccounts, disputes, bookedSessions]);

    const handleApprove = (id) => {
        approveTutor(id);
        setTutorApplicationsState([...tutorApplications]);
        setUserAccountsState([...userAccounts]);
        setSelectedApplication(null);
    };

    const handleReject = (id) => {
        rejectTutor(id);
        setTutorApplicationsState([...tutorApplications]);
        setSelectedApplication(null);
    };

    const handleResolveDispute = (id) => {
        const index = disputes.findIndex(d => d.id === id);
        if (index !== -1) {
            disputes.splice(index, 1);
        }
        setDisputesState([...disputes]);
    };

    const handleSuspendAccount = (id) => {
        const user = userAccountsState.find(u => u.id === id);
        if (user) {
            user.status = 'Suspended';
            setUserAccountsState([...userAccounts]);
        }
    };

    const handleUnsuspendAccount = (id) => {
        const user = userAccountsState.find(u => u.id === id);
        if (user) {
            user.status = 'Active';
            setUserAccountsState([...userAccounts]);
        }
    };

    const sectionTitleStyle = "text-3xl font-bold text-gray-800 mb-6 border-b pb-2";
    const listContainerStyle = "bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8";
    const itemStyle = "flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0";

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 mt-24">
            <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12">Admin Dashboard ⚙️</h1>

            {/* NEW: Section for Booked Sessions */}
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

            <hr className="my-12 border-gray-300" />
            
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

            <hr className="my-12 border-gray-300" />

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

            <hr className="my-12 border-gray-300" />

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
        </div>
    );
};

export default AdminDashboard;