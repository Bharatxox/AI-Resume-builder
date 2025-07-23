import React from "react";
import { getFontSizes } from "../../../utility/fontSizes"; // adjust path if needed

const LanguagesSection = ({ languages, themeColor, zoomLevel }) => {
  const { heading, text } = getFontSizes(zoomLevel);

  return (
    <section className={`${text}`}>
      {languages?.length > 0 && (
        <h2
          className={`font-semibold mb-2 border-b-2 pt-4 pb-2 ${heading}`}
          style={{ color: themeColor }}
        >
          Languages
        </h2>
      )}
      <ul className="list-disc pl-6">
        {languages?.map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>
    </section>
  );
};

export default LanguagesSection;
