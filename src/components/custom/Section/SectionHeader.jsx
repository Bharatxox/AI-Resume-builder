// components/Resume/Section/SectionHeader.jsx
import React from "react";
import { getFontSizes } from "../../../utility/fontSizes"; // Adjust path based on your structure

const SectionHeader = ({ title, themeColor, zoomLevel }) => {
  const { heading } = getFontSizes(zoomLevel);

  return (
    <h2
      className={`font-semibold pb-0.5 mb-0.5 border-b-1 ${heading} mt-2`}
      style={{ color: themeColor }}
    >
      {title}
    </h2>
  );
};

export default SectionHeader;
