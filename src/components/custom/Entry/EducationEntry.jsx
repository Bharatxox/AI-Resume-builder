import React from "react";
import { format } from "date-fns";
import { getFontSizes } from "../../../utility/fontSizes"; // Adjust path if needed

const EducationEntry = ({ edu, zoomLevel }) => {
  const { subheading } = getFontSizes(zoomLevel);

  return (
    <div className="">
      <div className="flex justify-between mt-1">
        <h2 className={`font-medium ${subheading}`}>
          {edu.degree}, {edu.major}
        </h2>
        <p className="italic">
          {edu.startDate ? format(new Date(edu.startDate), "MMM yyyy") : ""} –{" "}
          {edu.currentlyWorking
            ? "Present"
            : edu.endDate
            ? format(new Date(edu.endDate), "MMM yyyy")
            : ""}
        </p>
      </div>
      <p className="italic">{edu.universityName}</p>
      {edu.cgpa && <p className="font-medium">CGPA: {edu.cgpa}</p>}
      {edu.percentage && <p>Percentage: {edu.percentage}%</p>}
      {edu.description && <p>{edu.description}</p>}
    </div>
  );
};

export default EducationEntry;
