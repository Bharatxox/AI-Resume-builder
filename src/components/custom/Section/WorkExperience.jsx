import React from "react";

const WorkExperience = ({ experience, themeColor }) => {
  return (
    <section>
      <h2
        className="text-xl font-semibold pb-2 mb-2 border-b-2 pt-4"
        style={{ color: themeColor }}
      >
        Work Experience
      </h2>
      {experience?.map((exp) => (
        <div key={exp.id} className="mb-4">
          <h3 className="font-bold">
            {exp.title}, {exp.companyName}
          </h3>
          <p className="italic flex justify-between">
            <p>
              {exp.city}, {exp.state}
            </p>{" "}
            <p>
              {exp.startDate} – {exp.currentlyWorking ? "Present" : exp.endDate}
            </p>
          </p>
          <ul className="list-disc pl-6">
            {exp.workSummary.split("\n").map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default WorkExperience;
