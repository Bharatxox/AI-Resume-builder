import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Plus, Loader2, Stars, Trash } from "lucide-react";
import { toast } from "sonner";
import GlobalApi from "../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { Textarea } from "../../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { generateContent } from "../../../../service/GeminiService";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const EducationForm = ({ enableNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();

  const [educationList, setEducationList] = useState([
    {
      id: Date.now(),
      universityName: "",
      startDate: null,
      endDate: null,
      degree: "",
      major: "",
      cgpa: "",
      percentage: "",
      description: "",
      saved: false,
      isNew: true,
      gradeType: "cgpa",
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (resumeInfo?.education?.length > 0) {
      const updated = resumeInfo.education.map((edu) => ({
        ...edu,
        saved: true,
        isNew: true,
      }));
      setEducationList(updated);
    }
  }, [resumeInfo]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...educationList];
    updated[index][name] = value;
    updated[index].saved = false;
    setEducationList(updated);
    setResumeInfo((prev) => ({
      ...prev,
      education: updated.map(({ ...rest }) => rest),
    }));
    enableNext(false);
  };

  const handleDescriptionChange = (index, e) => {
    handleChange(index, {
      target: {
        name: "description",
        value: e.target.value,
      },
    });
  };

  const handleAddEducation = () => {
    const last = educationList[educationList.length - 1];
    if (!last.saved) return;

    setEducationList([
      ...educationList,
      {
        id: Date.now() + Math.random(),
        universityName: "",
        startDate: null,
        endDate: null,
        degree: "",
        major: "",
        cgpa: "",
        percentage: "",
        description: "",
        saved: false,
        isNew: true,
        gradeType: "cgpa",
      },
    ]);
  };

  const handleRemoveEducation = (idToRemove) => {
    const updated = educationList.filter((edu) => edu.id !== idToRemove);
    setEducationList(updated);
    setResumeInfo((prev) => ({
      ...prev,
      education: updated.map(({ ...rest }) => rest),
    }));
    enableNext(false);
  };

  const handleRadioChange = (index, value) => {
    const updated = [...educationList];
    updated[index].gradeType = value;
    updated[index].saved = false;
    if (value === "cgpa") {
      updated[index].percentage = "";
    } else if (value === "percentage") {
      updated[index].cgpa = "";
    }
    setEducationList(updated);
    setResumeInfo((prev) => ({
      ...prev,
      education: updated.map(({ ...rest }) => rest),
    }));
    enableNext(false);
  };

  const handleGenerateFromAI = async (index) => {
    setGenerating(true);
    try {
      const edu = educationList[index];
      const prompt = `Write a concise academic summary in 2–3 lines  (single paragraph) for a resume based on the following details:

University: ${edu.universityName}
Degree: ${edu.degree}
Major: ${edu.major}
Duration: ${edu.startDate} - ${edu.endDate}

Focus on:
- Relevant coursework, technical skills, or major-related projects
- Notable academic achievements or participation
- Keep it professional, clear, and concise
- Avoid bullet points, line breaks, or general fluff
- Return only the paragraph without any formatting or headers`;

      const result = await generateContent(prompt);

      const updated = [...educationList];
      updated[index].description = result;
      updated[index].saved = false;
      setEducationList(updated);
      setResumeInfo((prev) => ({
        ...prev,
        education: updated.map(({ ...rest }) => rest),
      }));
    } catch (err) {
      console.error("AI generation failed", err);
      toast.error("Failed to generate summary.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = () => {
    setSaving(true);

    const updated = educationList.map((edu) => ({ ...edu, saved: true }));
    setEducationList(updated);

    const data = {
      data: {
        education: updated.map(({ ...rest }) => rest),
      },
    };

    GlobalApi.UpdateResumeDetails(params?.resumeId, data)
      .then((resp) => {
        console.log("Education updated:", resp);
        enableNext(true);
        toast.success("Education updated!");
      })
      .catch((err) => {
        console.error("Update error:", err);
        toast.error("Failed to update education.");
      })
      .finally(() => {
        setSaving(false);
      });

    setResumeInfo((prev) => ({
      ...prev,
      education: updated.map(({ ...rest }) => rest),
    }));
  };

  const handleDateChange = (index, field, value) => {
    if (!value) return;
    const formattedDate = format(value, "MMM yyyy"); // → "Jul 2025"
    const updatedList = [...educationList];
    updatedList[index][field] = formattedDate;
    setEducationList(updatedList);
    setResumeInfo((prev) => ({
      ...prev,
      education: updatedList.map(({ ...rest }) => rest),
    }));

    enableNext(false);
  };

  return (
    <div
      className="p-5 shadow-lg rounded-lg border-t-green-500 mt-5"
      style={{ borderTopWidth: "5px" }}
    >
      <div className="max-w-xl mx-auto pb-3">
        <h2 className="font-bold text-lg">Education</h2>
        <p>Add your academic history</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
        {educationList.map((edu, idx) => (
          <div key={edu.id} className="space-y-4 p-4 border-1 rounded-lg py-6">
            <div className="grid gap-2">
              <Label>University Name *</Label>
              <Input
                name="universityName"
                value={edu.universityName}
                onChange={(e) => handleChange(idx, e)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Degree *</Label>
                <Input
                  name="degree"
                  value={edu.degree}
                  onChange={(e) => handleChange(idx, e)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Major *</Label>
                <Input
                  name="major"
                  value={edu.major}
                  onChange={(e) => handleChange(idx, e)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal cursor-pointer"
                    >
                      {edu.startDate
                        ? format(new Date(edu.startDate), "MMMM yyyy")
                        : `Select Date`}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={edu.startDate}
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
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal cursor-pointer"
                    >
                      {edu.endDate
                        ? format(new Date(edu.endDate), "MMMM yyyy")
                        : "Select Date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={edu.endDate}
                      onSelect={(date) =>
                        handleDateChange(idx, "endDate", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label>Grade Type</Label>
                  <RadioGroup
                    value={edu.gradeType}
                    onValueChange={(value) => handleRadioChange(idx, value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="cgpa" id={`cgpa-${idx}`} />
                      <Label htmlFor={`cgpa-${idx}`}>CGPA</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="percentage"
                        id={`percentage-${idx}`}
                      />
                      <Label htmlFor={`percentage-${idx}`}>Percentage</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label>CGPA</Label>
                    <Input
                      name="cgpa"
                      value={edu.cgpa}
                      onChange={(e) => handleChange(idx, e)}
                      disabled={edu.gradeType !== "cgpa"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Percentage</Label>
                    <Input
                      name="percentage"
                      value={edu.percentage}
                      onChange={(e) => handleChange(idx, e)}
                      disabled={edu.gradeType !== "percentage"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between items-end">
                <Label>Description *</Label>
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
                name="description"
                value={edu.description}
                onChange={(e) => handleDescriptionChange(idx, e)}
                required
              />
            </div>

            {edu.isNew && educationList.length > 1 && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleRemoveEducation(edu.id)}
                >
                  <Trash />
                  Remove
                </Button>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddEducation}
            disabled={!educationList[educationList.length - 1].saved}
          >
            <Plus />
            Add More Education
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EducationForm;
