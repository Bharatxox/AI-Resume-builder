import React from "react";
import { format } from "date-fns";

const EducationSection = ({ education, themeColor }) => {
  return (
    <section>
      {education?.length > 0 ? (
        <h2
          className="text-xl font-semibold pb-2 mb-2 border-b-2 pt-4"
          style={{ color: themeColor }}
        >
          Education
        </h2>
      ) : null}
      {education?.map((edu) => (
        <div key={edu.id} className="mb-3">
          <div className="flex justify-between">
            <h3 className="font-medium">
              {edu.degree}, {edu.major}
            </h3>
            <p className="italic flex justify-between">
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
