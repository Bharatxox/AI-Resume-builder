import React, { useContext } from "react";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import PersonalDetail from "./Section/PersonalDetail";
import WorkExperience from "./Section/WorkExperience";
import SkillsSection from "./Section/SkillsSection";
import EducationSection from "./Section/EducationSection";
import ProjectsSection from "./Section/ProjectsSection";
import SummarySection from "./Section/SummarySection";
import CertificationSection from "./Section/CertificationSection";
import HobbiesSection from "./Section/HobbiesSection";
import LanguagesSection from "./Section/LanguagesSection";

const ResumePreview = () => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  return (
    <div
      className="shadow-xl border-1 h-full p-14 border-t-[20px]"
      style={{ borderColor: resumeInfo?.themeColor }}
    >
      {/* Personal Detail */}
      <PersonalDetail resumeInfo={resumeInfo} />
      {/* Summary */}
      <SummarySection
        summary={resumeInfo?.summary}
        themeColor={resumeInfo?.themeColor}
      />
      {/* Working Experience */}
      <WorkExperience
        experience={resumeInfo?.experience}
        themeColor={resumeInfo?.themeColor}
      />
      {/* Skills */}
      <SkillsSection
        skills={resumeInfo?.skills}
        themeColor={resumeInfo?.themeColor}
      />
      {/* Educational */}
      <EducationSection
        education={resumeInfo?.education}
        themeColor={resumeInfo?.themeColor}
      />
      {/* Projects */}
      <ProjectsSection
        projects={resumeInfo?.projects}
        themeColor={resumeInfo?.themeColor}
      />
      {/* Certification  */}
      <CertificationSection
        certification={resumeInfo?.certification}
        themeColor={resumeInfo?.themeColor}
      />
      {/* Hobbies */}
      <HobbiesSection
        hobbies={resumeInfo?.hobbies}
        themeColor={resumeInfo?.themeColor}
      />
      {/* Languages */}
      <LanguagesSection
        languages={resumeInfo?.languages}
        themeColor={resumeInfo?.themeColor}
      />
    </div>
  );
};

export default ResumePreview;
