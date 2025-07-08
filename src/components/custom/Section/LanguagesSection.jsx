import React from "react";

const LanguagesSection = ({ languages, themeColor }) => {
  return (
    <section>
      {languages?.length > 0 && (
        <h2
          className="text-xl font-semibold mb-2 border-b-2 pt-4 pb-2"
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
