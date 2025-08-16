// src/components/dataStore.js

// Using 'let' so these arrays can be modified and new data can be added.
export let userAccounts = [
    { id: 'admin1', name: 'Admin User', email: 'admin@example.com', role: 'admin', password: 'password', status: 'Active' },
];

export let tutorApplications = [];

export let disputes = [];

export let approvedTutors = [];

export let bookedSessions = [];

/**
 * Adds a new tutor application to the pending list.
 * @param {object} application - The application data to add.
 */
export const addTutorApplication = (application) => {
    tutorApplications.push(application);
    console.log('New tutor application added:', application);
};

/**
 * Approves a tutor application, moving them to the approved list and creating a user account.
 * @param {string} id - The ID of the application to approve.
 */
export const approveTutor = (id) => {
    const application = tutorApplications.find(app => app.id === id);
    if (application) {
        // Create a new tutor profile for the approved list
        const newTutorProfile = {
            id: `tutor-${application.id}`,
            name: application.name,
            subjects: application.subjects,
            price: application.profileData.pricing.hourly,
            rating: 5.0, // Default rating for a new tutor
            location: 'Addis Ababa, Ethiopia', // Default location
            profilePic: application.profileData.profilePic,
            bio: application.profileData.bio,
            demoVideo: application.profileData.demoVideo,
        };

        approvedTutors.push(newTutorProfile);

        // Create a new user account for the tutor
        userAccounts.push({
            id: `user-${application.id}`,
            name: application.name,
            role: 'tutor',
            status: 'Active',
            email: application.email,
        });

        // Remove the application from the pending list
        const index = tutorApplications.findIndex(app => app.id === id);
        tutorApplications.splice(index, 1);
        console.log(`Tutor ${application.name} has been approved.`);
    }
};

/**
 * Rejects a tutor application, removing it from the pending list.
 * @param {string} id - The ID of the application to reject.
 */
export const rejectTutor = (id) => {
    const index = tutorApplications.findIndex(app => app.id === id);
    if (index !== -1) {
        tutorApplications.splice(index, 1);
        console.log(`Tutor application with ID ${id} has been rejected.`);
    }
};

/**
 * Adds a new dispute to the disputes list.
 * @param {object} dispute - The dispute data to add.
 */
export const addDispute = (dispute) => {
    disputes.push(dispute);
    console.log('New dispute added:', dispute);
};

/**
 * Adds a new booked session to the sessions list.
 * @param {object} session - The session data to add.
 */
export const addBookedSession = (session) => {
    bookedSessions.push(session);
    console.log('New session booked:', session);
};

// New function to update a booked session
export const updateBookedSession = (updatedSession) => {
    const index = bookedSessions.findIndex(s => s.id === updatedSession.id);
    if (index !== -1) {
        bookedSessions[index] = updatedSession;
    }
};

// New function to delete a booked session
export const deleteBookedSession = (id) => {
    const index = bookedSessions.findIndex(s => s.id === id);
    if (index !== -1) {
        bookedSessions.splice(index, 1);
    }
};

/**
 * Retrieves all approved tutors from the user accounts list.
 * @returns {Array} An array of approved tutor profiles.
 */
export const getApprovedTutors = () => {
    return approvedTutors;
};

/**
 * Finds a user by their email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {object|undefined} The user object if found, otherwise undefined.
 */
export const findUser = (email, password) => {
    return userAccounts.find(user => user.email === email && user.password === password);
};
