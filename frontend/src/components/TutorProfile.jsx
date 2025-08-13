import React from 'react';

const TutorProfile = ({ tutor }) => {

  const dummyTutor = tutor || {
    id: '123',
    name: 'Mela Alemu',
    profilePic: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=EW',
    bio: 'Experienced educator with a passion for making complex subjects understandable. I specialize in Math and Physics for high school and college students. My teaching philosophy focuses on building strong foundational concepts and fostering critical thinking.',
    subjects: ['Mathematics', 'Physics', 'Calculus', 'Algebra'],
    hourlyRate: 50,
    education: [
      { degree: 'Ph.D. in Physics', institution: 'University of Cambridge' },
      { degree: 'B.Sc. in Mathematics', institution: 'University of Oxford' },
    ],
    workExperience: [
      { role: 'High School Teacher', company: 'Springfield High School (5 years)' },
      { role: 'University Lecturer (TA)', company: 'University of Cambridge (3 years)' },
    ],
    reviews: [
      { student: 'Alice B.', rating: 5, comment: 'Dr. Watson made calculus fun! Highly recommend.' },
      { student: 'John D.', rating: 4, comment: 'Very knowledgeable and patient. Helped me understand complex topics.' },
    ],
    availability: 'Mon-Fri: 4 PM - 8 PM, Sat: 10 AM - 2 PM',
    isVerified: true,
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 my-8">
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
        <img
          src={dummyTutor.profilePic}
          alt={${dummyTutor.name}'s profile}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md mb-4 md:mb-0 md:mr-6"
        />
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-900 flex items-center justify-center md:justify-start">
            {dummyTutor.name}
            {dummyTutor.isVerified && (
              <span className="ml-3 text-blue-600 text-xl" title="Verified Tutor">
                ✅
              </span>
            )}
          </h2>
          <p className="text-xl text-gray-700 mt-2">{dummyTutor.subjects.join(', ')}</p>
          <p className="text-2xl font-semibold text-green-600 mt-3">
            ${dummyTutor.hourlyRate}/hour
          </p>
          <div className="flex items-center justify-center md:justify-start mt-3">
            <span className="text-yellow-500 text-xl mr-2">⭐️</span>
            <span className="text-gray-700 text-lg">
              {dummyTutor.reviews.length > 0
                ? (dummyTutor.reviews.reduce((sum, r) => sum + r.rating, 0) / dummyTutor.reviews.length).toFixed(1)
                : 'No ratings yet'}
            </span>
            <span className="text-gray-500 text-md ml-2">({dummyTutor.reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">About Me</h3>
        <p className="text-gray-700 text-lg leading-relaxed">{dummyTutor.bio}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Education</h3>
        <ul className="list-disc list-inside text-gray-700 text-lg">
          {dummyTutor.education.map((edu, index) => (
            <li key={index}>
              <strong>{edu.degree}</strong> from {edu.institution}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Work Experience</h3>
        <ul className="list-disc list-inside text-gray-700 text-lg">
          {dummyTutor.workExperience.map((work, index) => (
            <li key={index}>
              <strong>{work.role}</strong> at {work.company}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Availability</h3>
        <p className="text-gray-700 text-lg">{dummyTutor.availability}</p>
      </div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Student Reviews</h3>
        {dummyTutor.reviews.length > 0 ? (
          <div className="space-y-4">
            {dummyTutor.reviews.map((review, index) => (
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