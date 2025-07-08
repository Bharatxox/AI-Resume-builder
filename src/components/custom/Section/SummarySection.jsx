import React from "react";

const SummarySection = ({ summary, themeColor }) => {
  return (
    <section>
      {summary && (
        <h2
          className="text-xl font-semibold pb-2 mb-2 border-b-2 pt-4"
          style={{ color: themeColor }}
        >
          Summary
        </h2>
      )}
      <p>{summary}</p>
    </section>
  );
};

export default SummarySection;
