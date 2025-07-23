import React from "react";
import { format } from "date-fns";
import { getFontSizes } from "../../../utility/fontSizes";

export default function WorkExperienceEntry({ exp, zoomLevel }) {
  const { subheading, text } = getFontSizes(zoomLevel);
  const bullets = exp.workSummary
    .split("\n")
    .filter((point) => point.trim() !== "");

  return (
    <div key={exp.id || exp._id}>
      <div className="mb-1">
        <div className="flex justify-between">
          <h3 className={`font-semibold ${subheading}`}>
            {exp.title}, {exp.companyName}
          </h3>
          <p className={`italic ${text}`}>
            {exp.startDate ? format(new Date(exp.startDate), "MMM yyyy") : ""} –{" "}
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
      </div>
      {bullets.length > 0 && (
        <ul className="pl-6 list-disc">
          {bullets.map((point, i) => (
            <li key={`bullet-${exp.id || exp._id}-${i}`}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
