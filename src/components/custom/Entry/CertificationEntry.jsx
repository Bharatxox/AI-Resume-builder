// CertificationEntrySplit.jsx
import React from "react";
import { format } from "date-fns";
import { getFontSizes } from "../../../utility/fontSizes";

export default function CertificationEntry({ cert, zoomLevel }) {
  const { subheading, text } = getFontSizes(zoomLevel);
  const bullets =
    cert.description?.split("\n").filter((point) => point.trim() !== "") || [];

  return (
    <div key={cert.id}>
      <div className="mb-1">
        <div className="flex justify-between">
          <h3 className={`font-semibold ${subheading}`}>{cert.name}</h3>
          <p className={`italic ${text}`}>
            {cert.issueDate ? format(new Date(cert.issueDate), "MMM yyyy") : ""}
          </p>
        </div>
        <p className={`${text}`}>{cert.organization}</p>
      </div>
      {bullets.length > 0 && (
        <ul className="pl-6 list-disc">
          {bullets.map((point, i) => (
            <li key={`bullet-${cert.id}-${i}`}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
