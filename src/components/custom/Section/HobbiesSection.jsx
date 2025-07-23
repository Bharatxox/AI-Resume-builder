import React from "react";
import { getFontSizes } from "../../../utility/fontSizes"; // adjust path if needed

const HobbiesSection = ({ hobbies, themeColor, zoomLevel }) => {
  const { heading, text } = getFontSizes(zoomLevel);

  return (
    <section className={`${text}`}>
      {hobbies?.length > 0 && (
        <h2
          className={`font-semibold mb-2 border-b-2 pt-4 pb-2 ${heading}`}
          style={{ color: themeColor }}
        >
          Hobbies
        </h2>
      )}
      <ul className="list-disc pl-6">
        {hobbies?.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>
    </section>
  );
};

export default HobbiesSection;
