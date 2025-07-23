import { format } from "date-fns";
import React from "react";
import { getFontSizes } from "../../../utility/fontSizes"; // Adjust path if needed

const CertificationSection = ({ certification, themeColor, zoomLevel }) => {
  const { heading, subheading, text } = getFontSizes(zoomLevel);

  return (
    <section className={`${text}`}>
      {certification?.length > 0 && (
        <h2
          className={`font-semibold mb-2 border-b-2 pt-4 pb-2 ${heading}`}
          style={{ color: themeColor }}
        >
          Certification
        </h2>
      )}

      {certification?.map((cert) => (
        <div key={cert.id} className="mb-3">
          <div className="flex justify-between">
            <h3 className={`font-medium ${subheading}`}>{cert.title}</h3>
            <p className="italic">
              {cert.startDate
                ? format(new Date(cert.startDate), "MMM-yyyy")
                : ""}{" "}
              –{" "}
              {cert.currentlyWorking
                ? "Present"
                : cert.endDate
                ? format(new Date(cert.endDate), "MMM-yyyy")
                : ""}
            </p>
          </div>

          <div className="flex justify-between">
            <p>{cert.organization}</p>
            {cert.link && (
              <a href={cert.link} className="text-blue-600 underline">
                View
              </a>
            )}
          </div>

          <ul className="list-disc pl-6">
            {cert.description
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

export default CertificationSection;
