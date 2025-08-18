// API configuration and helper functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// No token management needed - using HttpOnly cookies

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    credentials: 'include', // Include cookies for session auth
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  getCurrentUser: () => 
    apiRequest('/auth/me'),

  forgotPassword: (email) => 
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  resetPassword: (token, password) => 
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    })
};

// Tutor API functions
export const tutorAPI = {
  searchTutors: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/tutors/search?${queryParams}`);
  },

  getTutorProfile: (tutorId) => 
    apiRequest(`/tutors/${tutorId}`),

  updateTutorProfile: (profileData) => 
    apiRequest('/tutors/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),

  addReview: (tutorId, reviewData) => 
    apiRequest(`/tutors/${tutorId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    }),

  getTutorReviews: (tutorId, page = 1) => 
    apiRequest(`/tutors/${tutorId}/reviews?page=${page}`)
};

// Session API functions
export const sessionAPI = {
  bookSession: (sessionData) => 
    apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    }),

  getUserSessions: (status = '') => {
    const query = status ? `?status=${status}` : '';
    return apiRequest(`/sessions${query}`);
  },

  updateSession: (sessionId, updateData) => 
    apiRequest(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    }),

  cancelSession: (sessionId) => 
    apiRequest(`/sessions/${sessionId}/cancel`, {
      method: 'PUT'
    }),

  getSessionDetails: (sessionId) => 
    apiRequest(`/sessions/${sessionId}`)
};

// Tutor Application API functions
export const applicationAPI = {
  submitApplication: (applicationData) => 
    apiRequest('/tutor-applications', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    }),

  getApplicationStatus: () => 
    apiRequest('/tutor-applications/status'),

  getAllApplications: (status = '') => {
    const query = status ? `?status=${status}` : '';
    return apiRequest(`/admin/tutor-applications${query}`);
  },

  updateApplicationStatus: (applicationId, status, feedback = '') => 
    apiRequest(`/admin/tutor-applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, feedback })
    })
};

// Dispute API functions
export const disputeAPI = {
  submitDispute: (disputeData) => 
    apiRequest('/disputes', {
      method: 'POST',
      body: JSON.stringify(disputeData)
    }),

  getUserDisputes: () => 
    apiRequest('/disputes'),

  getAllDisputes: (status = '') => {
    const query = status ? `?status=${status}` : '';
    return apiRequest(`/admin/disputes${query}`);
  },

  updateDisputeStatus: (disputeId, status, resolution = '') => 
    apiRequest(`/admin/disputes/${disputeId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, resolution })
    })
};

// Contact API functions
export const contactAPI = {
  submitContact: (contactData) => 
    apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData)
    }),

  getAllContacts: (status = '') => {
    const query = status ? `?status=${status}` : '';
    return apiRequest(`/admin/contacts${query}`);
  },

  updateContactStatus: (contactId, status) => 
    apiRequest(`/admin/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
};

// Notification API functions
export const notificationAPI = {
  getNotifications: (page = 1, limit = 20) => 
    apiRequest(`/notifications?page=${page}&limit=${limit}`),

  markAsRead: (notificationId) => 
    apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT'
    }),

  markAllAsRead: () => 
    apiRequest('/notifications/read-all', {
      method: 'PUT'
    }),

  deleteNotification: (notificationId) => 
    apiRequest(`/notifications/${notificationId}`, {
      method: 'DELETE'
    })
};

// Stats API functions
export const statsAPI = {
  getAdminStats: () => 
    apiRequest('/stats/admin'),

  getTutorStats: () => 
    apiRequest('/stats/tutor'),

  getStudentStats: () => 
    apiRequest('/stats/student')
};

// Availability API functions
export const availabilityAPI = {
  getTutorAvailability: (tutorId) => 
    apiRequest(`/availability/${tutorId}`),

  updateAvailability: (availabilityData) => 
    apiRequest('/availability', {
      method: 'PUT',
      body: JSON.stringify(availabilityData)
    }),

  bookTimeSlot: (tutorId, slotData) => 
    apiRequest(`/availability/${tutorId}/book`, {
      method: 'POST',
      body: JSON.stringify(slotData)
    }),

  releaseTimeSlot: (tutorId, slotData) => 
    apiRequest(`/availability/${tutorId}/release`, {
      method: 'POST',
      body: JSON.stringify(slotData)
    })
};

// Room API functions
export const roomAPI = {
  createRoom: (roomData) => 
    apiRequest('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData)
    }),

  joinRoom: (roomId) => 
    apiRequest(`/rooms/${roomId}/join`, {
      method: 'POST'
    }),

  leaveRoom: (roomId) => 
    apiRequest(`/rooms/${roomId}/leave`, {
      method: 'POST'
    }),

  getRoomDetails: (roomId) => 
    apiRequest(`/rooms/${roomId}`),

  sendMessage: (roomId, message) => 
    apiRequest(`/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message })
    })
};

// User management API functions
export const userAPI = {
  getAllUsers: (role = '', page = 1) => {
    const query = new URLSearchParams({ ...(role && { role }), page }).toString();
    return apiRequest(`/admin/users?${query}`);
  },

  updateUserStatus: (userId, status) => 
    apiRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),

  getUserProfile: (userId) => 
    apiRequest(`/users/${userId}`),

  updateProfile: (profileData) => 
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
};

// File upload helper
export const uploadFile = async (file, type = 'general') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    credentials: 'include', // Use session cookies
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};

// Error handling helper
export const handleAPIError = (error) => {
  if (error.message.includes('401') || error.message.includes('Authentication')) {
    // Session expired or invalid - redirect to login
    window.location.href = '/login';
    return;
  }
  
  console.error('API Error:', error);
  return error.message || 'An unexpected error occurred';
};

export default {
  authAPI,
  tutorAPI,
  sessionAPI,
  applicationAPI,
  disputeAPI,
  contactAPI,
  notificationAPI,
  statsAPI,
  availabilityAPI,
  roomAPI,
  userAPI,
  uploadFile,
  handleAPIError
};
