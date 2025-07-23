import React, { useEffect } from "react";
import { getFontSizes } from "../../../utility/fontSizes"; // adjust path if needed

const SummarySection = ({ summary, themeColor, zoomLevel }) => {
  const { heading, text } = getFontSizes(zoomLevel);

  useEffect(() => {
    console.log("Zoom level:", zoomLevel);
    console.log("Font size class:", heading, text);
  });

  return (
    <section className={`${text}`}>
      {summary && (
        <h2
          className={`font-semibold pb-1 mb-1 border-b-1 pt-4 ${heading}`}
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
