import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Plus, Loader2, Stars, Trash } from "lucide-react";
import { Textarea } from "../../ui/textarea";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../service/GlobalApi";
import { generateContent } from "../../../../service/GeminiService";
import { toast } from "sonner";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { format } from "date-fns";

const CertificationForm = ({ enableNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();

  const [certifications, setCertifications] = useState([
    {
      id: Date.now(),
      title: "",
      organization: "",
      startDate: null,
      endDate: null,
      description: "",
      link: "",
      saved: false,
      isNew: true,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (resumeInfo?.certification?.length > 0) {
      const updated = resumeInfo.certification.map((cert) => ({
        ...cert,
        saved: true,
        isNew: true,
      }));
      setCertifications(updated);
    }
  }, [resumeInfo]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...certifications];
    updated[index][name] = value;
    updated[index].saved = false;
    setCertifications(updated);

    setResumeInfo((prev) => ({
      ...prev,
      certification: updated.map((item) => ({ ...item })),
    }));
    enableNext(false);
  };

  const handleAddCertification = () => {
    const last = certifications[certifications.length - 1];
    if (!last.saved) return;

    const newCert = {
      id: Date.now() + Math.random(),
      title: "",
      organization: "",
      startDate: null,
      endDate: null,
      description: "",
      link: "",
      saved: false,
      isNew: true,
    };
    setCertifications([...certifications, newCert]);
  };

  const handleRemoveCertification = (idToRemove) => {
    const updated = certifications.filter((cert) => cert.id !== idToRemove);
    setCertifications(updated);
    setResumeInfo((prev) => ({
      ...prev,
      certification: updated.map((item) => ({ ...item })),
    }));
    enableNext(false);
  };

  const handleGenerateFromAI = async (index) => {
    setGenerating(true);
    try {
      const cert = certifications[index];
      const prompt = `Generate a 3–5 line resume-ready description of the following certification with line breaks but no extra line at the end:

Title: ${cert.title}
Organization: ${cert.organization}

Technologies/Topics: Mention frontend/backend stacks, tools, and achievements clearly if applicable.
Avoid markdown or bullet symbols.`;

      const result = await generateContent(prompt);

      const updated = [...certifications];
      updated[index].description = result.trim();
      updated[index].saved = false;
      setCertifications(updated);

      setResumeInfo((prev) => ({
        ...prev,
        certification: updated.map((item) => ({ ...item })),
      }));
    } catch (err) {
      console.error("AI generation failed", err);
      toast.error("Failed to generate description.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = () => {
    setSaving(true);

    const updated = certifications.map((cert) => ({
      ...cert,
      saved: true,
    }));
    setCertifications(updated);

    GlobalApi.UpdateResumeDetails(params?.resumeId, {
      data: { certification: updated },
    })
      .then(() => {
        toast.success("Certifications updated!");
        enableNext(true);
      })
      .catch((err) => {
        console.error("Update error:", err);
        toast.error("Failed to update certifications.");
      })
      .finally(() => {
        setSaving(false);
      });

    setResumeInfo((prev) => ({
      ...prev,
      certification: updated,
    }));
  };

  const handleDateChange = (index, field, value) => {
    if (!value) return;
    const formattedDate = format(value, "MMM yyyy"); // → "Jul 2025"
    const updatedList = [...certifications];
    updatedList[index][field] = formattedDate;
    setCertifications(updatedList);
    setResumeInfo((prev) => ({
      ...prev,
      certification: updatedList.map(({ ...rest }) => rest),
    }));

    enableNext(false);
  };

  return (
    <div
      className="p-5 shadow-lg rounded-lg border-t-purple-500 mt-5"
      style={{ borderTopWidth: "5px" }}
    >
      <div className="max-w-xl mx-auto">
        <h2 className="font-bold text-lg">Certifications</h2>
        <p>List your professional certifications</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
        {certifications.map((cert, idx) => (
          <div key={cert.id} className="space-y-4 pt-4 border-b pb-4">
            <div className="grid gap-2">
              <Label>Certification Title *</Label>
              <Input
                name="title"
                value={cert.title}
                onChange={(e) => handleChange(idx, e)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Organization *</Label>
              <Input
                name="organization"
                value={cert.organization}
                onChange={(e) => handleChange(idx, e)}
                required
              />
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
                      {cert.startDate
                        ? format(new Date(cert.startDate), "MMMM yyyy")
                        : `Select Date`}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={cert.startDate}
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
                      {cert.endDate
                        ? format(new Date(cert.endDate), "MMMM yyyy")
                        : "Select Date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={cert.endDate}
                      onSelect={(date) =>
                        handleDateChange(idx, "endDate", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                    <Loader2 className="animate-spin ml-2" />
                  ) : (
                    <Stars className="ml-2" />
                  )}
                </Button>
              </div>
              <Textarea
                name="description"
                value={cert.description}
                onChange={(e) => handleChange(idx, e)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Certificate Link *</Label>
              <Input
                name="link"
                value={cert.link}
                onChange={(e) => handleChange(idx, e)}
                required
              />
            </div>

            {cert.isNew && certifications.length > 1 && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleRemoveCertification(cert.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
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
            onClick={handleAddCertification}
            disabled={!certifications[certifications.length - 1].saved}
          >
            <Plus />
            Add More Certification
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CertificationForm;
