import React from "react";
import { format } from "date-fns";
import { getFontSizes } from "../../../utility/fontSizes"; // Adjust path if needed

const EducationSection = ({ education, themeColor, zoomLevel }) => {
  const { heading, subheading, text } = getFontSizes(zoomLevel);

  return (
    <section className={`${text}`}>
      {education?.length > 0 && (
        <h2
          className={`font-semibold pb-2 mb-2 border-b-2 pt-4 ${heading}`}
          style={{ color: themeColor }}
        >
          Education
        </h2>
      )}

      {education?.map((edu) => (
        <div key={edu.id} className="mb-3">
          <div className="flex justify-between">
            <h3 className={`font-medium ${subheading}`}>
              {edu.degree}, {edu.major}
            </h3>
            <p className="italic">
              {edu.startDate ? format(new Date(edu.startDate), "MMM yyyy") : ""}{" "}
              –{" "}
              {edu.currentlyWorking
                ? "Present"
                : edu.endDate
                ? format(new Date(edu.endDate), "MMM-yyyy")
                : ""}
            </p>
          </div>

          <p className="italic">{edu.universityName}</p>

          {edu.cgpa && <p className="font-medium">CGPA: {edu.cgpa}</p>}
          {edu.percentage && <p>Percentage: {edu.percentage}%</p>}
          {edu.description && <p>{edu.description}</p>}
        </div>
      ))}
    </section>
  );
};

export default EducationSection;
