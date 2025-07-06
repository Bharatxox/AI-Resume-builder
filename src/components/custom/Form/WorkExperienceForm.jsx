import { useContext, useEffect, useState } from "react";
import GlobalApi from "../../../../service/GlobalApi";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";
import { Loader2, Plus, Stars, Trash } from "lucide-react";
import { generateContent } from "../../../../service/GeminiService";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const WorkExperienceForm = ({ enableNext }) => {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [experiences, setExperiences] = useState([
    {
      id: Date.now(),
      title: "",
      companyName: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      workSummary: "",
      saved: false,
      isNew: true,
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (resumeInfo?.experience?.length > 0) {
      const updated = resumeInfo?.experience.map((exp) => ({
        ...exp,
        saved: true,
        isNew: true,
      }));
      setExperiences(updated);
    }
  }, [resumeInfo]);

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updated = [...experiences];
    updated[index][name] = type === "checkbox" ? checked : value;
    updated[index].saved = false;
    setExperiences(updated);
    setResumeInfo((prev) => ({
      ...prev,
      experience: updated.map(({ ...rest }) => rest),
    }));
    enableNext(false);
  };

  const handleAddExperience = () => {
    const last = experiences[experiences.length - 1];
    if (!last.saved) return; // Prevent adding unless last is saved

    const newExperience = {
      id: Date.now() + Math.random(),
      title: "",
      companyName: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      workSummary: "",
      saved: false,
      isNew: true,
    };
    setExperiences([...experiences, newExperience]);
  };

  const handleGenerateFromAI = async (index) => {
    setGenerating(true);
    try {
      const exp = experiences[index];
      const prompt = `Generate a concise and technical 4–6 line work summary for a resume based on the following job details:

Job Title: ${exp.title}
Company: ${exp.companyName}
City: ${exp.city}, State: ${exp.state}

The summary should:
- Focus on core technical responsibilities and achievements
- Avoid placeholders or markdown (no asterisks, no bold)
- Avoid general phrases like “collaborated with team”
- Use bullet-style sentences (separated by line breaks), not long paragraphs
- Return only the summary

Example format:
Developing and maintaining interactive, responsive frontend components using React and Tailwind CSS.
Translating design wireframes into high-quality, functional code.
...`;

      const result = await generateContent(prompt);

      const updated = [...experiences];
      updated[index].workSummary = result;
      updated[index].saved = false;
      setExperiences(updated);

      // Sync with context
      setResumeInfo((prev) => ({
        ...prev,
        experience: updated.map(({ ...rest }) => rest),
      }));
    } catch (err) {
      console.error("AI generation failed", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = () => {
    setSaving(true);

    const updated = experiences.map((exp) => ({ ...exp, saved: true }));
    setExperiences(updated);

    const data = {
      data: {
        experience: updated.map(({ ...rest }) => rest), // omit `saved`
      },
    };

    GlobalApi.UpdateResumeDetails(params?.resumeId, data)
      .then((resp) => {
        console.log("Work experience updated:", resp);
        enableNext(true);
        toast.success("Experience updated!");
      })
      .catch((err) => {
        console.error("Update error:", err);
        toast.error("Failed to update experience.");
      })
      .finally(() => {
        setSaving(false);
      });

    // Sync to context as well (optional but good)
    setResumeInfo((prev) => ({
      ...prev,
      experience: updated.map(({ ...rest }) => rest),
    }));
  };

  const handleRemoveExperience = (idToRemove) => {
    const updated = experiences.filter((exp) => exp.id !== idToRemove);
    setExperiences(updated);
    setResumeInfo((prev) => ({
      ...prev,
      experience: updated.map(({ ...rest }) => rest),
    }));
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
          <div key={exp.id} className="space-y-4 pt-4 border-1 rounded-lg p-5">
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
                onCheckedChange={(checked) => {
                  const e = {
                    target: {
                      name: "currentlyWorking",
                      type: "checkbox",
                      checked,
                    },
                  };
                  handleChange(idx, e);
                }}
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
                  onClick={() => handleGenerateFromAI(idx)}
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
            {exp.isNew && experiences.length > 1 && (
              <div className="flex justify-end">
                <Button
                  className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  type="button"
                  variant="outline"
                  onClick={() => handleRemoveExperience(exp.id)}
                >
                  <Trash />
                  Remove
                </Button>
              </div>
            )}
          </div>
        ))}

        <div className="">
          <div className="flex justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddExperience}
              disabled={!experiences[experiences.length - 1].saved}
            >
              <Plus />
              Add More Experience
            </Button>

            <Button type="button" onClick={handleSubmit} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WorkExperienceForm;
