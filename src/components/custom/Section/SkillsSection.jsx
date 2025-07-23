import React from "react";
import { getFontSizes } from "../../../utility/fontSizes"; // adjust path if needed

const SkillsSection = ({ skills, themeColor, zoomLevel }) => {
  const { heading, subheading, text } = getFontSizes(zoomLevel);

  return (
    <section className={`${text}`}>
      {skills?.length > 0 && (
        <h2
          className={`font-semibold mt-1 pb-0.5 mb-0.5 border-b-1 ${heading}`}
          style={{ color: themeColor }}
        >
          Skills
        </h2>
      )}
      <div className="flex justify-between gap-4">
        {skills?.map((group, idx) => (
          <div key={idx} className="flex flex-col items-start">
            <h3 className={`font-semibold ${subheading}`}>{group.title}</h3>
            <ul className="list-disc pl-4 leading-2.5">
              {group?.items?.map((skill, i) => (
                <li
                  className={`text-start font-medium ${text}`}
                  style={{ color: themeColor }}
                  key={i}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
