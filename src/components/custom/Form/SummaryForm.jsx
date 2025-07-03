import React, { useContext, useEffect, useState } from "react";
import GlobalApi from "../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Loader2, Stars } from "lucide-react";
import { toast } from "sonner";
import { generateContent } from "../../../../service/GeminiService";

const SummaryForm = ({ enableNext }) => {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (resumeInfo?.summary) {
      setSummary(resumeInfo.summary);
    }
  }, [resumeInfo]);

  const handleChange = (e) => {
    enableNext(false);
    const { name, value } = e.target;
    setSummary(value);

    // 🔁 Update context
    setResumeInfo({
      ...resumeInfo,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const data = {
      data: { summary: summary },
    };

    GlobalApi.UpdateResumeDetails(params?.resumeId, data)
      .then(
        (resp) => {
          console.log("Form submitted", resp);
          enableNext(true);
          toast.success("Detail Updated");
        },
        (err) => {
          console.log("Error msg", err);
        }
      )
      .finally(() => setSaving(false));
  };

  const handleGenerateFromAI = async () => {
    setGenerating(true);
    try {
      let userWordCount = summary.trim().split(/\s+/).length;

      let finalPrompt = "";

      if (userWordCount >= 20) {
        finalPrompt = `Improve and polish the following resume summary to be more professional, concise, and aligned with the job title "${resumeInfo?.jobTitle}":
      
      "${summary}"

      Return only the improved summary.`;
      } else {
        finalPrompt = `job title: ${resumeInfo?.jobTitle}, depending on the job title, generate a 3–4 line technical and professional resume summary aligned with the core responsibilities and expectations of the role. Return summary only—no extra text.`;
      }

      const result = await generateContent(finalPrompt);
      setSummary(result);
      setResumeInfo({
        ...resumeInfo,
        summary: result,
      });
      toast.success("Summary generated!");
    } catch (error) {
      toast.error("Failed to generate summary.", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      className="p-5 shadow-lg rounded-lg border-t-sky-400 mt-5"
      style={{ borderTopWidth: "5px" }}
    >
      <div className=" max-w-xl mx-auto">
        <h2 className="font-bold text-lg">Personal Details</h2>
        <p>Get Started with the basic information</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
        <div className="grid gap-3 mt-5">
          <div className="flex justify-between items-end">
            <Label htmlFor="summary">
              Summary <span className="text-red-600">*</span>
            </Label>
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateFromAI}
              disabled={generating}
            >
              Generate from AI{" "}
              {generating ? <Loader2 className="animate-spin" /> : <Stars />}
            </Button>
          </div>
          <Textarea
            required
            id="summary"
            name="summary"
            value={summary}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SummaryForm;
