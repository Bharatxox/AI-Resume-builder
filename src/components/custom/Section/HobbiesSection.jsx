import React from "react";

const HobbiesSection = ({ hobbies, themeColor }) => {
  return (
    <section>
      {hobbies?.length > 0 && (
        <h2
          className="text-xl font-semibold mb-2 border-b-2 pt-4 pb-2"
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
