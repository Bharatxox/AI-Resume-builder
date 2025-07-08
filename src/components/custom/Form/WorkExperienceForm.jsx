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
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

const WorkExperienceForm = ({ enableNext }) => {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [experiences, setExperiences] = useState([
    {
      experienceId: uuidv4(), // Use uuidv4 for unique IDs
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
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    enableNext(false);
  }, []);

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

  useEffect(() => {
    if (skip) {
      // Clear experience from context
      setResumeInfo((prev) => ({
        ...prev,
        experience: [],
      }));
    }
  }, [skip]);

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
      experienceId: uuidv4(), // Use uuidv4 for unique IDs
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
        experience: updated.map(
          ({
            experienceId,
            title,
            companyName,
            city,
            state,
            startDate,
            endDate,
            currentlyWorking,
            workSummary,
            isNew,
            saved,
          }) => ({
            experienceId,
            title,
            companyName,
            city,
            state,
            // Format correctly as YYYY-MM-DD (safe format for Strapi)
            startDate: startDate
              ? format(new Date(startDate), "yyyy-MM-dd")
              : null,
            endDate: currentlyWorking
              ? null
              : endDate
              ? format(new Date(endDate), "yyyy-MM-dd")
              : null,
            currentlyWorking,
            workSummary,
            isNew,
            saved,
          })
        ),
      },
    };

    console.log("🚀 Sending to Strapi:", JSON.stringify(data, null, 2));

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
        enableNext(true);
      });

    // Sync to context as well (optional but good)
    setResumeInfo((prev) => ({
      ...prev,
      experience: updated.map(({ ...rest }) => rest),
    }));
  };

  const handleRemoveExperience = (idToRemove) => {
    const updated = experiences.filter(
      (exp) => exp.experienceId !== idToRemove
    );
    setExperiences(updated);
    setResumeInfo((prev) => ({
      ...prev,
      experience: updated.map(({ ...rest }) => rest),
    }));
  };

  const handleDateChange = (index, field, value) => {
    if (!value) return;
    const formattedDate = format(value, "MMM yyyy"); // → "Jul 2025"
    const updatedList = [...experiences];
    updatedList[index][field] = formattedDate;
    setExperiences(updatedList);
    setResumeInfo((prev) => ({
      ...prev,
      experience: updatedList.map(({ ...rest }) => rest),
    }));

    enableNext(false);
  };

  return (
    <div
      className="p-5 shadow-lg rounded-lg border-t-sky-400 mt-5"
      style={{ borderTopWidth: "5px" }}
    >
      <div className="max-w-xl mx-auto flex justify-between items-start">
        <div>
          <h2 className="font-bold text-lg">Work Experience</h2>
          <p>Fill in your work history</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Checkbox
            name="SkipWorkExperience"
            checked={skip}
            onCheckedChange={(checked) => {
              setSkip(checked);
              enableNext(checked);
            }}
          />
          <Label>Skip this section</Label>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
        {experiences.map((exp, idx) => (
          <div
            key={exp.experienceId}
            className="space-y-4 pt-4 border-1 rounded-lg p-5"
          >
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
                  disabled={skip}
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
                  disabled={skip}
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
                  disabled={skip}
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
                  disabled={skip}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild disabled={skip}>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal cursor-pointer"
                    >
                      {exp.startDate
                        ? format(new Date(exp.startDate), "MMMM yyyy")
                        : `Select Date`}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={exp.startDate}
                      onSelect={(date) =>
                        handleDateChange(idx, "startDate", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger
                    asChild
                    disabled={exp.currentlyWorking || skip}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal cursor-pointer"
                    >
                      {exp.endDate
                        ? format(new Date(exp.endDate), "MMMM yyyy")
                        : "Select Date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={exp.endDate}
                      onSelect={(date) =>
                        handleDateChange(idx, "endDate", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                name="currentlyWorking"
                checked={exp.currentlyWorking}
                onChange={(e) => handleChange(idx, e)}
                disabled={skip}
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
                  disabled={generating || skip}
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
                disabled={skip}
              />
            </div>
            {exp.isNew && experiences.length > 1 && (
              <div className="flex justify-end">
                <Button
                  className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  type="button"
                  variant="outline"
                  onClick={() => handleRemoveExperience(exp.experienceId)}
                  disabled={skip}
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
              disabled={!experiences[experiences.length - 1].saved || skip}
            >
              <Plus />
              Add More Experience
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={saving || skip}
            >
              {saving ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WorkExperienceForm;
