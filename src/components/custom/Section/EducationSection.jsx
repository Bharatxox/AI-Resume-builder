import React from "react";

const EducationSection = ({ education, themeColor }) => {
  return (
    <section>
      <h2
        className="text-xl font-semibold pb-2 mb-2 border-b-2 pt-4"
        style={{ color: themeColor }}
      >
        Education
      </h2>
      {education?.map((edu) => (
        <div key={edu.id} className="mb-3">
          <div className="flex justify-between">
            <h3 className="font-bold">
              {edu.degree}, {edu.major}
            </h3>
            <p>
              {" "}
              {edu.startDate} - {edu.endDate}
            </p>
          </div>

          <p>{edu.universityName}</p>

          {edu.cgpa && <p>CGPA: {edu.cgpa}</p>}
          {edu.percentage && <p>Percentage: {edu.percentage}%</p>}
          {edu.description && <p>{edu.description}</p>}
        </div>
      ))}
    </section>
  );
};

export default EducationSection;
