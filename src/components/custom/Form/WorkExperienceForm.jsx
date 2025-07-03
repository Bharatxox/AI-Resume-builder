import React, { useContext, useEffect, useState } from "react";
// import GlobalApi from "../../../../service/GlobalApi";
// import { useParams } from "react-router-dom";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";
import { Loader2, Stars } from "lucide-react";
// import { toast } from "sonner";

const WorkExperienceForm = ({ enableNext }) => {
  // const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [experiences, setExperiences] = useState([
    {
      title: "",
      companyName: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      workSummary: "",
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (resumeInfo?.experience?.length > 0) {
      setExperiences(resumeInfo.experience);
    }
  }, [resumeInfo]);

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updated = [...experiences];
    updated[index][name] = type === "checkbox" ? checked : value;
    setExperiences(updated);
    setResumeInfo({
      ...resumeInfo,
      experience: updated,
    });
    enableNext(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      data: { experience: experiences },
    };
    console.log(data);
    // GlobalApi.UpdateResumeDetails(params?.resumeId, data)
    //   .then((resp) => {
    //     toast.success("Experience Updated");
    //     enableNext(true);
    //   })
    //   .catch((err) => {
    //     console.log("Error msg", err);
    //     toast.error("Error updating experience");
    //   })
    //   .finally(() => setSaving(false));
  };

  return (
    <div
      className="p-5 shadow-lg rounded-lg border-t-sky-400 mt-5"
      style={{ borderTopWidth: "5px" }}
    >
      <div className="max-w-xl mx-auto">
        <h2 className="font-bold text-lg">Work Experience</h2>
        <p>Fill in your work history</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
        {experiences.map((exp, idx) => (
          <div key={idx} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>
                  Job Title <span className="text-red-600">*</span>
                </Label>
                <Input
                  name="title"
                  value={exp.title}
                  onChange={(e) => handleChange(idx, e)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>
                  Company Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  name="companyName"
                  value={exp.companyName}
                  onChange={(e) => handleChange(idx, e)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>
                  City <span className="text-red-600">*</span>
                </Label>
                <Input
                  name="city"
                  value={exp.city}
                  onChange={(e) => handleChange(idx, e)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>
                  State <span className="text-red-600">*</span>
                </Label>
                <Input
                  name="state"
                  value={exp.state}
                  onChange={(e) => handleChange(idx, e)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>
                  Start Date <span className="text-red-600">*</span>
                </Label>
                <Input
                  name="startDate"
                  value={exp.startDate}
                  onChange={(e) => handleChange(idx, e)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Input
                  name="endDate"
                  value={exp.endDate}
                  onChange={(e) => handleChange(idx, e)}
                  disabled={exp.currentlyWorking}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                name="currentlyWorking"
                checked={exp.currentlyWorking}
                onChange={(e) => handleChange(idx, e)}
              />
              <Label>Currently Working Here</Label>
            </div>

            <div className="grid gap-3">
              <div className="flex justify-between items-end">
                <Label>
                  Work Summary <span className="text-red-600">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  // onClick={handleGenerateFromAI}
                  disabled={generating}
                >
                  Generate from AI{" "}
                  {generating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Stars />
                  )}
                </Button>
              </div>
              <Textarea
                name="workSummary"
                value={exp.workSummary}
                onChange={(e) => handleChange(idx, e)}
                required
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <div className="flex justify-between gap-2">
            <Button type="button" variant="outline">
              Add
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WorkExperienceForm;
