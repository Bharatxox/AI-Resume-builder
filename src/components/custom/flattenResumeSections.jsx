// flattenResumeSections.js
import React from "react";
import PersonalDetail from "./Section/PersonalDetail";
import SummarySection from "./Section/SummarySection";
import SectionHeader from "./Section/SectionHeader";
import WorkExperienceEntry from "./Entry/WorkExperienceEntry";
import EducationEntry from "./Entry/EducationEntry";
import ProjectEntry from "./Entry/ProjectEntry";
import CertificationEntry from "./Entry/CertificationEntry";
import HobbiesSection from "./Section/HobbiesSection";
import LanguagesSection from "./Section/LanguagesSection";
import SkillEntry from "./Entry/SkillEntry";
import SkillsSection from "./Section/SkillsSection";
import { getFontSizes } from "../../utility/fontSizes"; // Adjust path if needed

export function flattenResumeSections(resumeInfo, zoomLevel) {
  const themeColor = resumeInfo?.themeColor;
  const elements = [];

  // Personal Details (always present)
  elements.push(
    <PersonalDetail
      resumeInfo={resumeInfo}
      themeColor={themeColor}
      zoomLevel={zoomLevel}
      key="personal"
    />
  );

  // Summary
  if (resumeInfo.summary && resumeInfo.summary.trim()) {
    elements.push(
      <SummarySection
        summary={resumeInfo.summary}
        themeColor={themeColor}
        zoomLevel={zoomLevel}
        key="summary"
      />
    );
  }

  // Work Experience
  if (Array.isArray(resumeInfo.experience) && resumeInfo.experience.length) {
    elements.push(
      <SectionHeader
        title="Work Experience"
        themeColor={themeColor}
        zoomLevel={zoomLevel}
        key="work-header"
      />
    );
    resumeInfo.experience.forEach((exp) => {
      elements.push(
        <WorkExperienceEntry
          exp={exp}
          themeColor={themeColor}
          zoomLevel={zoomLevel}
          key={exp.id || exp._id}
        />
      );
    });
  }

  // Skills
  if (Array.isArray(resumeInfo.skills) && resumeInfo.skills.length) {
    elements.push(
      <SkillsSection
        skills={resumeInfo.skills}
        // title="Skills"
        themeColor={themeColor}
        zoomLevel={zoomLevel}
        key="skills-header"
      />
    );
    // resumeInfo.skills.forEach((group, idx) => {
    //   // Optionally, add group title as a subheader
    //   if (group.title) {
    //     elements.push(
    //       <div
    //         key={`skills-group-title-${idx}`}
    //         className={`font-semibold`}
    //         style={{ color: themeColor }}
    //       >
    //         {group.title}
    //       </div>
    //     );
    //   }
    //   group.items.forEach((skill, i) => {
    //     elements.push(
    //       <SkillEntry
    //         skill={skill}
    //         themeColor={themeColor}
    //         zoomLevel={zoomLevel}
    //         key={`skill-${idx}-${i}`}
    //       />
    //     );
    //   });
    // });
  }

  // Education
  if (Array.isArray(resumeInfo.education) && resumeInfo.education.length) {
    elements.push(
      <SectionHeader
        title="Education"
        themeColor={themeColor}
        zoomLevel={zoomLevel}
        key="education-header"
      />
    );
    resumeInfo.education.forEach((edu, idx) => {
      elements.push(
        <EducationEntry
          edu={edu}
          themeColor={themeColor}
          zoomLevel={zoomLevel}
          key={`education-${edu.id || idx}`}
        />
      );
    });
  }

  // Projects
  // Inside flattenResumeSections.js

  if (Array.isArray(resumeInfo.projects) && resumeInfo.projects.length) {
    elements.push(
      <SectionHeader
        title="Projects"
        themeColor={resumeInfo.themeColor}
        zoomLevel={zoomLevel}
        key="project-header"
      />
    );

    resumeInfo.projects.forEach((project) => {
      // Project header block
      elements.push(
        <div key={`project-header-${project.id}`} className="mb-1">
          <div className="flex justify-between">
            <h3
              className={`font-semibold ${getFontSizes(zoomLevel).subheading}`}
            >
              {project.title}
            </h3>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-blue-600 underline ${
                  getFontSizes(zoomLevel).text
                }`}
              >
                Link
              </a>
            )}
          </div>
          <p className={`${getFontSizes(zoomLevel).text}`}>
            Technologies:{" "}
            {Array.isArray(project.technologies)
              ? project.technologies.join(", ")
              : String(project.technologies || "")}
          </p>
        </div>
      );

      // Flatten each bullet point in the description as a separate <li>
      const bullets = project.description
        ? project.description.split("\n").filter((point) => point.trim() !== "")
        : [];

      bullets.forEach((point, i) => {
        elements.push(
          <li
            key={`project-bullet-${project.id}-${i}`}
            className={`pl-6 list-disc ${getFontSizes(zoomLevel).text}`}
          >
            {point}
          </li>
        );
      });
    });
  }

  // Certifications
  if (
    Array.isArray(resumeInfo.certification) &&
    resumeInfo.certification.length
  ) {
    elements.push(
      <SectionHeader
        title="Certifications"
        themeColor={themeColor}
        zoomLevel={zoomLevel}
        key="certifications-header"
      />
    );
    resumeInfo.certification.forEach((cert) => {
      elements.push(
        <CertificationEntry
          cert={cert}
          themeColor={themeColor}
          zoomLevel={zoomLevel}
          key={cert.id}
        />
      );
    });
  }

  // Hobbies
  if (Array.isArray(resumeInfo.hobbies) && resumeInfo.hobbies.length) {
    elements.push(
      <HobbiesSection
        hobbies={resumeInfo.hobbies}
        themeColor={themeColor}
        zoomLevel={zoomLevel}
        key="hobbies"
      />
    );
  }

  // Languages
  if (Array.isArray(resumeInfo.languages) && resumeInfo.languages.length) {
    elements.push(
      <LanguagesSection
        languages={resumeInfo.languages}
        themeColor={themeColor}
        zoomLevel={zoomLevel}
        key="languages"
      />
    );
  }

  return elements;
}
