import { format } from "date-fns";
import React from "react";
import { getFontSizes } from "../../../utility/fontSizes"; // Adjust path if necessary

const WorkExperience = ({ experience, themeColor, zoomLevel }) => {
  const { heading, subheading, text } = getFontSizes(zoomLevel);

  return (
    <section className={`${text}`}>
      {experience?.length > 0 && (
        <h2
          className={`font-semibold pb-2 mb-2 border-b-2 pt-4 ${heading}`}
          style={{ color: themeColor }}
        >
          Work Experience
        </h2>
      )}

      {experience?.map((exp) => (
        <div key={exp.id} className="mb-4">
          <div className="flex justify-between">
            <h3 className={`font-semibold ${subheading}`}>
              {exp.title}, {exp.companyName}
            </h3>
            <p className={`italic ${text}`}>
              {exp.startDate ? format(new Date(exp.startDate), "MMM yyyy") : ""}{" "}
              –{" "}
              {exp.currentlyWorking
                ? "Present"
                : exp.endDate
                ? format(new Date(exp.endDate), "MMM yyyy")
                : ""}
            </p>
          </div>

          <p className={`italic ${text}`}>
            {exp.city}, {exp.state}
          </p>

          <ul className="list-disc pl-6">
            {exp.workSummary
              .split("\n")
              .filter((point) => point.trim() !== "")
              .map((point, i) => (
                <li key={i}>{point}</li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default WorkExperience;
