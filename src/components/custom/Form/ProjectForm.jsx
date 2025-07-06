import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Plus, Loader2, Stars, Trash } from "lucide-react";
import { Textarea } from "../../ui/textarea";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../service/GlobalApi";
import { generateContent } from "../../../../service/GeminiService";
import { TagsInput } from "react-tag-input-component";

const ProjectForm = ({ enableNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();

  const [projects, setProjects] = useState([
    {
      id: Date.now(),
      title: "",
      technologies: [],
      description: "",
      link: "",
      saved: false,
      isNew: false,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (resumeInfo?.projects?.length > 0) {
      const updated = resumeInfo.projects.map((proj) => ({
        ...proj,
        technologies: Array.isArray(proj.technologies)
          ? proj.technologies
          : typeof proj.technologies === "string"
          ? proj.technologies.split(",").map((t) => t.trim())
          : [],
        saved: true,
        isNew: true,
      }));
      setProjects(updated);
    }
  }, [resumeInfo]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...projects];
    updated[index][name] = value;
    updated[index].saved = false;
    setProjects(updated);

    setResumeInfo((prev) => ({
      ...prev,
      projects: updated,
    }));
    enableNext(false);
  };

  const handleAddProject = () => {
    const last = projects[projects.length - 1];
    if (!last.saved) return;

    const newProj = {
      id: Date.now() + Math.random(),
      title: "",
      technologies: [],
      description: "",
      link: "",
      saved: false,
      isNew: true,
    };
    setProjects([...projects, newProj]);
  };

  const handleRemoveProject = (idToRemove) => {
    const updated = projects.filter((proj) => proj.id !== idToRemove);
    setProjects(updated);
    setResumeInfo((prev) => ({
      ...prev,
      projects: updated,
    }));
    enableNext(false);
  };

  const handleGenerateFromAI = async (index) => {
    setGenerating(true);
    try {
      const proj = projects[index];
      const prompt = `Write a 4–6 line technical resume project description with line breaks but not extra sapce for the following:

Project Title: ${proj.title}
Technologies: ${proj.technologies?.join(", ")}

Requirements:
- Use bullet-style format
- Be concise and focus on core features, APIs used, optimizations, and results
- Avoid markdown, asterisks, or vague phrases`;

      const result = await generateContent(prompt);

      const updated = [...projects];
      updated[index].description = result;
      updated[index].saved = false;
      setProjects(updated);

      setResumeInfo((prev) => ({
        ...prev,
        projects: updated.map((proj) => ({
          ...proj,
        })),
      }));
    } catch (err) {
      console.error("AI generation failed", err);
      toast.error("Failed to generate project summary.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = () => {
    setSaving(true);

    const updated = projects.map((proj) => ({
      ...proj,
      saved: true,
      isNew: false,
    }));

    setProjects(updated);

    GlobalApi.UpdateResumeDetails(params?.resumeId, {
      data: { projects: updated },
    })
      .then((resp) => {
        console.log("Projects updated:", resp);
        enableNext(true);
        toast.success("Projects updated!");
      })
      .catch((err) => {
        console.error("Update error:", err);
        toast.error("Failed to update projects.");
      })
      .finally(() => {
        setSaving(false);
      });

    setResumeInfo((prev) => ({
      ...prev,
      projects: updated,
    }));
  };

  return (
    <div
      className="p-5 shadow-lg rounded-lg border-t-yellow-500 mt-5"
      style={{ borderTopWidth: "5px" }}
    >
      <div className="max-w-xl mx-auto">
        <h2 className="font-bold text-lg">Projects</h2>
        <p>List your top technical projects</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
        {projects.map((proj, idx) => (
          <div key={proj.id} className="space-y-4 pt-4 border-b pb-4">
            <div className="grid gap-2">
              <Label>Project Title *</Label>
              <Input
                name="title"
                value={proj.title}
                onChange={(e) => handleChange(idx, e)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Technologies (comma separated) *</Label>
              <TagsInput
                value={
                  Array.isArray(proj.technologies) ? proj.technologies : []
                }
                onChange={(newTags) => {
                  const updated = [...projects];
                  updated[idx].technologies = newTags;
                  updated[idx].saved = false;
                  setProjects(updated);

                  setResumeInfo((prev) => ({
                    ...prev,
                    projects: updated,
                  }));

                  enableNext(false);
                }}
                name={`technologies-${proj.id}`}
                placeHolder="Enter technology"
              />
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
                value={proj.description}
                onChange={(e) => handleChange(idx, e)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Project Link *</Label>
              <Input
                name="link"
                value={proj.link}
                onChange={(e) => handleChange(idx, e)}
                required
              />
            </div>

            {proj.isNew && projects.length > 1 && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleRemoveProject(proj.id)}
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
            onClick={handleAddProject}
            disabled={!projects[projects.length - 1].saved}
          >
            <Plus />
            Add More Project
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
