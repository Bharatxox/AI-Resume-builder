import React from "react";

const SkillsSection = ({ skills, themeColor }) => {
  return (
    <section>
      {skills?.length > 0 && (
        <h2
          className="text-xl font-semibold pb-2 mb-2 border-b-2 pt-4"
          style={{ color: themeColor }}
        >
          Skills
        </h2>
      )}
      <div className="flex justify-between gap-4">
        {skills?.map((group, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <h3 className="font-semibold mb-1">{group.title}</h3>
            <ul className="list-disc pl-4">
              {group?.items?.map((skill, i) => (
                <li
                  className=" list text-start font-medium"
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
