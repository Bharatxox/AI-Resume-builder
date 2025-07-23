import React, { useContext, useEffect, useState } from "react";
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
import { ArrowRight, ArrowLeft, LayoutGrid, Home, View } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";
import GlobalApi from "../../../service/GlobalApi";
import { toast } from "sonner";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import ViewResume from "./ViewResume";

const FormSection = () => {
  const params = useParams();
  const { setResumeInfo } = useContext(ResumeInfoContext);
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);
  const [themeColor, setThemeColor] = useState("#00b894");

  useEffect(() => {
    UpdateThemeColor(themeColor);
  }, [themeColor]);

  const UpdateThemeColor = (color) => {
    const data = {
      data: {
        themeColor: color,
      },
    };
    GlobalApi.UpdateResumeDetails(params?.resumeId, data)
      .then(() => {
        toast.success("Theme color updated successfully!");
        setResumeInfo((prev) => ({ ...prev, themeColor: color }));
      })
      .catch((error) => {
        toast.error("Failed to update theme color.");
        console.error("Failed to update theme color:", error);
      });
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Link to="/dashboard">
            <Button>
              <Home />
            </Button>
          </Link>
          <ThemeSelector
            themeColor={themeColor}
            setThemeColor={setThemeColor}
          />
        </div>
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

      {activeFormIndex == 3 ? (
        <WorkExperienceForm enableNext={(v) => setEnableNext(v)} />
      ) : null}

      {/* Skills Forms */}
      {activeFormIndex == 4 ? (
        <SkillsForm enableNext={(v) => setEnableNext(v)} />
      ) : null}

      {/* Education Form */}
      {activeFormIndex == 5 ? (
        <EducationForm enableNext={(v) => setEnableNext(v)} />
      ) : null}

      {/* Project Form */}
      {activeFormIndex == 6 ? (
        <ProjectForm enableNext={(v) => setEnableNext(v)} />
      ) : null}

      {/* Certification Form */}
      {activeFormIndex == 7 ? (
        <CertificationForm enableNext={(v) => setEnableNext(v)} />
      ) : null}

      {/* Hobbies Form */}
      {activeFormIndex == 8 ? (
        <HobbiesForm enableNext={(v) => setEnableNext(v)} />
      ) : null}

      {/* Language Form */}
      {activeFormIndex == 9 ? (
        <LanguageForm enableNext={(v) => setEnableNext(v)} />
      ) : null}

      {/* Resume View */}
      {activeFormIndex == 10 ? (
        <Navigate to={`/my-resume/${params?.resumeId}/view`} />
      ) : null}
    </div>
  );
};

export default FormSection;
