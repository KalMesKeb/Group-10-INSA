import React from 'react';

const TutorProfile = ({ tutor }) => {
  // Use actual user data or provide fallback values
  const tutorData = {
    id: tutor?.id || tutor?._id || '',
    name: tutor?.name || tutor?.fullName || 'Your Name',
    profilePic: tutor?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor?.name || tutor?.fullName || 'User')}&background=3b82f6&color=ffffff&size=150`,
    bio: tutor?.bio || 'Complete your profile to add a bio.',
    subjects: tutor?.subjects || [],
    hourlyRate: tutor?.hourlyRate || 0,
    education: tutor?.education || [],
    workExperience: tutor?.workExperience || [],
    reviews: tutor?.reviews || [],
    availability: tutor?.availability || 'Set your availability in profile settings',
    isVerified: tutor?.isVerified || false,
    email: tutor?.email || ''
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 my-8">
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
        <img
          src={tutorData.profilePic}
          alt={`${tutorData.name}'s profile`}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md mb-4 md:mb-0 md:mr-6"
        />
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-900 flex items-center justify-center md:justify-start">
            {tutorData.name}
            {tutorData.isVerified && (
              <span className="ml-3 text-blue-600 text-xl" title="Verified Tutor">
                ✅
              </span>
            )}
          </h2>
          <p className="text-xl text-gray-700 mt-2">{tutorData.subjects.join(', ')}</p>
          <p className="text-2xl font-semibold text-green-600 mt-3">
            ${tutorData.hourlyRate}/hour
          </p>
          <div className="flex items-center justify-center md:justify-start mt-3">
            <span className="text-yellow-500 text-xl mr-2">⭐️</span>
            <span className="text-gray-700 text-lg">
              {tutorData.reviews.length > 0
                ? (
                    tutorData.reviews.reduce((sum, r) => sum + r.rating, 0) /
                    tutorData.reviews.length
                  ).toFixed(1)
                : 'No ratings yet'}
            </span>
            <span className="text-gray-500 text-md ml-2">({tutorData.reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">About Me</h3>
        <p className="text-gray-700 text-lg leading-relaxed">{tutorData.bio}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Education</h3>
        <ul className="list-disc list-inside text-gray-700 text-lg">
          {tutorData.education.map((edu, index) => (
            <li key={index}>
              <strong>{edu.degree}</strong> from {edu.institution}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Work Experience</h3>
        <ul className="list-disc list-inside text-gray-700 text-lg">
          {tutorData.workExperience.map((work, index) => (
            <li key={index}>
              <strong>{work.role}</strong> at {work.company}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Availability</h3>
        <p className="text-gray-700 text-lg">{tutorData.availability}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Student Reviews</h3>
        {tutorData.reviews.length > 0 ? (
          <div className="space-y-4">
            {tutorData.reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-gray-800 mr-2">{review.student}</span>
                  <span className="text-yellow-500">{'⭐️'.repeat(review.rating)}</span>
                </div>
                <p className="text-gray-700 italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to leave one!</p>
        )}
      </div>

      <div className="text-center mt-10">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
          Book a Session
        </button>
      </div>
    </div>
  );
};

export default TutorProfile;
