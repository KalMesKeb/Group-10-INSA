import Notification from '../models/Notification.js';

/**
 * Create and send a notification
 * @param {Object} params - Notification parameters
 * @param {String} params.recipient - User ID of recipient
 * @param {String} params.sender - User ID of sender (optional)
 * @param {String} params.type - Notification type
 * @param {String} params.title - Notification title
 * @param {String} params.message - Notification message
 * @param {Object} params.data - Additional data (optional)
 * @param {String} params.priority - Priority level (optional)
 */
const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  data = {},
  priority = 'medium'
}) => {
  try {
    const notification = new Notification({
      recipient,
      sender,
      type,
      title,
      message,
      data,
      priority
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Send session booking notification to tutor
 */
const notifySessionBooked = async (session) => {
  return createNotification({
    recipient: session.tutor,
    sender: session.student,
    type: 'session_booked',
    title: 'New Session Booked',
    message: `You have a new session booked for ${session.subject} on ${new Date(session.scheduledDate).toLocaleDateString()}`,
    data: {
      sessionId: session._id,
      url: `/sessions/${session._id}`
    },
    priority: 'high'
  });
};

/**
 * Send session cancellation notification
 */
const notifySessionCancelled = async (session, cancelledBy) => {
  const recipient = cancelledBy === session.student ? session.tutor : session.student;
  const senderName = cancelledBy === session.student ? 'Student' : 'Tutor';
  
  return createNotification({
    recipient,
    sender: cancelledBy,
    type: 'session_cancelled',
    title: 'Session Cancelled',
    message: `Your session for ${session.subject} on ${new Date(session.scheduledDate).toLocaleDateString()} has been cancelled by the ${senderName.toLowerCase()}`,
    data: {
      sessionId: session._id
    },
    priority: 'high'
  });
};

/**
 * Send session reminder notification
 */
const notifySessionReminder = async (session, recipient) => {
  return createNotification({
    recipient,
    type: 'session_reminder',
    title: 'Session Reminder',
    message: `Your session for ${session.subject} starts in 1 hour`,
    data: {
      sessionId: session._id,
      url: `/live-session/${session.roomId}`
    },
    priority: 'high'
  });
};

/**
 * Send tutor application status notification
 */
const notifyTutorApplicationStatus = async (application, status) => {
  const statusMessages = {
    approved: 'Congratulations! Your tutor application has been approved.',
    rejected: 'Your tutor application has been reviewed and unfortunately was not approved at this time.'
  };

  return createNotification({
    recipient: application.applicantId,
    type: `tutor_application_${status}`,
    title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: statusMessages[status],
    data: {
      applicationId: application._id
    },
    priority: 'high'
  });
};

/**
 * Send dispute creation notification to admin
 */
const notifyDisputeCreated = async (dispute) => {
  // This would typically send to all admins
  // For now, we'll assume there's a way to get admin users
  return createNotification({
    recipient: 'admin', // This should be replaced with actual admin user IDs
    sender: dispute.reporter,
    type: 'dispute_created',
    title: 'New Dispute Reported',
    message: `A new dispute has been reported: ${dispute.title}`,
    data: {
      disputeId: dispute._id,
      url: `/admin/disputes/${dispute._id}`
    },
    priority: 'high'
  });
};

/**
 * Send dispute resolution notification
 */
const notifyDisputeResolved = async (dispute) => {
  const notifications = [];
  
  // Notify reporter
  notifications.push(createNotification({
    recipient: dispute.reporter,
    type: 'dispute_resolved',
    title: 'Dispute Resolved',
    message: `Your dispute "${dispute.title}" has been resolved.`,
    data: {
      disputeId: dispute._id
    },
    priority: 'medium'
  }));

  // Notify reported user if different
  if (dispute.reportedUser && dispute.reportedUser.toString() !== dispute.reporter.toString()) {
    notifications.push(createNotification({
      recipient: dispute.reportedUser,
      type: 'dispute_resolved',
      title: 'Dispute Resolved',
      message: `A dispute involving you has been resolved.`,
      data: {
        disputeId: dispute._id
      },
      priority: 'medium'
    }));
  }

  return Promise.all(notifications);
};

/**
 * Send new review notification to tutor
 */
const notifyNewReview = async (tutorId, review) => {
  return createNotification({
    recipient: tutorId,
    sender: review.student,
    type: 'new_review',
    title: 'New Review Received',
    message: `You received a ${review.rating}-star review from a student`,
    data: {
      reviewId: review._id,
      rating: review.rating
    },
    priority: 'medium'
  });
};

/**
 * Send bulk notifications to multiple users
 */
const sendBulkNotifications = async (notifications) => {
  try {
    const results = await Promise.allSettled(
      notifications.map(notification => createNotification(notification))
    );
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    console.log(`Bulk notifications sent: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
};

export {
  createNotification,
  notifySessionBooked,
  notifySessionCancelled,
  notifySessionReminder,
  notifyTutorApplicationStatus,
  notifyDisputeCreated,
  notifyDisputeResolved,
  notifyNewReview,
  sendBulkNotifications
};
