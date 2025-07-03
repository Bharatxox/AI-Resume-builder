import React, { useState } from "react";
import SummaryForm from "./Form/SummaryForm";
import WorkExperienceForm from "./Form/WorkExperienceForm";
import SkillsForm from "./Form/SkillsForm";
import EducationForm from "./Form/EducationForm";
import ProjectForm from "./Form/ProjectForm";
import CertificationForm from "./Form/CertificationForm";
import HobbiesForm from "./Form/HobbiesForm";
import LanguageForm from "./Form/LanguageForm";
import PersonalDetailForm from "./Form/PersonalDetailForm";
import { Button } from "../ui/button";
import { ArrowRight, ArrowLeft, LayoutGrid } from "lucide-react";

const FormSection = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);

  return (
    <div>
      <div className="flex justify-between">
        <Button variant="outline">
          <LayoutGrid />
          Theme
        </Button>
        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button
              variant="outline"
              onClick={() => setActiveFormIndex((prev) => prev - 1)}
            >
              <ArrowLeft /> Previous
            </Button>
          )}
          {activeFormIndex <= 9 && (
            <Button
              disabled={!enableNext}
              onClick={() => setActiveFormIndex((prev) => prev + 1)}
            >
              Next
              <ArrowRight />
            </Button>
          )}
          {activeFormIndex == 10 && <Button>Submit</Button>}
        </div>
      </div>

      {/* Personal Deatil Form */}
      {activeFormIndex == 1 ? (
        <PersonalDetailForm enableNext={(v) => setEnableNext(v)} />
      ) : null}

      {/* Summary Form */}

      {activeFormIndex == 2 ? (
        <SummaryForm enableNext={(v) => setEnableNext(v)} />
      ) : null}

      {/* Working Experience Form */}
      <WorkExperienceForm />

      {/* Skills Forms */}
      <SkillsForm />

      {/* Education Form */}
      <EducationForm />

      {/* Project Form */}
      <ProjectForm />

      {/* Certification Form */}
      <CertificationForm />
      {/* Hobbies Form */}
      <HobbiesForm />

      {/* Language Form */}
      <LanguageForm />
    </div>
  );
};

export default FormSection;
