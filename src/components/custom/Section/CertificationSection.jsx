import { format } from "date-fns";
import React from "react";

const CertificationSection = ({ certification, themeColor }) => {
  return (
    <section>
      {certification?.length > 0 ? (
        <h2
          className="text-xl font-semibold mb-2 border-b-2 pt-4 pb-2"
          style={{ color: themeColor }}
        >
          Certification
        </h2>
      ) : null}
      {certification?.map((cert) => (
        <div key={cert.id} className="mb-3">
          <div className="flex justify-between">
            <h3 className="font-medium">{cert.title}</h3>

            <p className="italic flex justify-between">
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
              <a href={cert.link} className="text-blue-600">
                View
              </a>
            )}
          </div>
          <ul className="list-disc pl-6">
            {cert.description.split("\n").map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default CertificationSection;
