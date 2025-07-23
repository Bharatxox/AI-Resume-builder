import React from "react";
import { getFontSizes } from "../../../utility/fontSizes";

const PersonalDetail = ({ resumeInfo, themeColor, zoomLevel }) => {
  const { text, mainHeading } = getFontSizes(zoomLevel);
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
    <div className={`text-center ${text}`}>
      <h2 className={`font-bold ${mainHeading}`} style={{ color: themeColor }}>
        {firstName} {lastName}
      </h2>
      <div
        className={`flex flex-wrap justify-center gap-x-1 text-center px-15`}
      >
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
