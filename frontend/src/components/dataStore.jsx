

export const tutorApplications = [
    {
        id: 'app1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        subjects: ['Math', 'Physics'],
        status: 'Pending',
        profileData: {
            bio: 'Experienced math and physics tutor with a passion for helping students succeed.',
            education: [{ degree: 'M.Sc. Physics', institution: 'Addis Ababa University' }],
            workExperience: [{ role: 'Teacher', company: 'Sample High School' }],
            pricing: { hourly: 500 },
            availability: { text: 'Mon-Fri 4 PM - 8 PM' },
            profilePic: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=John',
            demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
        },
    },
    {
        id: 'app2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        subjects: ['English', 'Literature'],
        status: 'Pending',
        profileData: {
            bio: 'Creative writing and literature expert. I make learning fun and interactive!',
            education: [{ degree: 'B.A. English', institution: 'Unity University' }],
            workExperience: [{ role: 'Freelance Writer', company: '' }],
            pricing: { hourly: 450 },
            availability: { text: 'Tues-Thurs 5 PM - 7 PM' },
            profilePic: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Jane',
            demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
        },
    },
];

export const userAccounts = [
    { id: 'user3', name: 'Student A', role: 'student', status: 'Active' },
    { id: 'user4', name: 'Student B', role: 'student', status: 'Active' },
];

export const disputes = [
    { id: 'dispute1', tutor: 'John Doe', student: 'Student A', issue: 'Tutor was a no-show for a session.', status: 'Open' },
    { id: 'dispute2', tutor: 'Jane Smith', student: 'Student B', issue: 'Disagreement over payment for a session.', status: 'Open' },
];

// Array to store approved tutors with their full profile data
export const approvedTutors = [
    {
        id: 't1',
        name: 'Mela Somon',
        subjects: ['Math', 'Algebra', 'Geometry'],
        price: 45,
        rating: 4.8,
        location: 'Jinka, Ethiopia',
        profilePic: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=MS',
        bio: 'Passionate math tutor helping students achieve their full potential. I have over 10 years of experience and have helped hundreds of students improve their grades and confidence.',
    },
    {
        id: 't2',
        name: 'Bemenit Demeisya',
        subjects: ['Physics', 'Chemistry', 'Calculus'],
        price: 60,
        rating: 4.9,
        location: 'bardhair, Ethiopia',
        profilePic: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=BD',
        bio: 'Experienced science tutor making complex topics easy to grasp. My approach is to relate concepts to real-world examples, ensuring a deep understanding.',
    },
];

export const addTutorApplication = (application) => {
    tutorApplications.push(application);
};

export const approveTutor = (id) => {
    const application = tutorApplications.find(app => app.id === id);
    if (application) {
        // Create the tutor profile object for the student dashboard
        const newTutorProfile = {
            id: `tutor-${application.id}`, // Unique ID for approved tutors
            name: application.name,
            subjects: application.subjects,
            price: application.profileData.pricing.hourly, // Use the hourly price from the profile data
            rating: 5.0, // Default rating for new tutors
            location: 'Addis Ababa, Ethiopia', // This would come from the form
            profilePic: application.profileData.profilePic,
            bio: application.profileData.bio,
            demoVideo: application.profileData.demoVideo,
        };

        // Add the new tutor to the approved list
        approvedTutors.push(newTutorProfile);

        // Move the tutor to the user accounts list
        userAccounts.push({
            id: `user-${application.id}`,
            name: application.name,
            role: 'tutor',
            status: 'Active',
        });

        // Remove the application from the pending list
        const index = tutorApplications.findIndex(app => app.id === id);
        tutorApplications.splice(index, 1);
    }
};

export const rejectTutor = (id) => {
    const index = tutorApplications.findIndex(app => app.id === id);
    if (index !== -1) {
        tutorApplications.splice(index, 1);
    }
};

// New function to add a dispute
export const addDispute = (dispute) => {
    disputes.push(dispute);
};
