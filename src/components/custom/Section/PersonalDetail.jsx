import React from "react";

const PersonalDetail = ({ resumeInfo, themeColor }) => {
  const { firstName, lastName, address, phone, email, linkedin, github } =
    resumeInfo || {};

  const personalDetails = [
    address,
    email && (
      <a href={`mailto:${email}`} className="text-blue-600 underline">
        {email}
      </a>
    ),
    phone,
    linkedin && (
      <a href={linkedin} className="text-blue-600 underline">
        LinkedIn
      </a>
    ),
    github && (
      <a href={github} className="text-blue-600 underline">
        GitHub
      </a>
    ),
  ].filter(Boolean); // removes empty or undefined items

  return (
    <div className="text-center space-y-2">
      <h2 className="font-bold text-2xl" style={{ color: themeColor }}>
        {firstName} {lastName}
      </h2>
      <div className="flex flex-wrap justify-center gap-2 text-sm text-center">
        {personalDetails.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-gray-400">|</span>}
            <span>{item}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PersonalDetail;
