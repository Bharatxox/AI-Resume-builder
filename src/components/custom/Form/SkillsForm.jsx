import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Plus, Trash, Loader2 } from "lucide-react";
import { TagsInput } from "react-tag-input-component";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../service/GlobalApi";

const SkillsForm = ({ enableNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();

  const [skills, setSkills] = useState([
    { id: Date.now(), title: "", items: [], saved: false, isNew: true },
  ]);
  const [saving, setSaving] = useState(false);
  const [skillsInitialized, setSkillsInitialized] = useState(false);

  useEffect(() => {
    if (!skillsInitialized && resumeInfo?.skills?.length > 0) {
      const loaded = resumeInfo.skills.map((s) => ({
        ...s,
        id: Date.now() + Math.random(),
        saved: true,
        isNew: true,
      }));
      setSkills(loaded);
      setSkillsInitialized(true); // ✅ prevent re-triggering
    }
  }, [resumeInfo, skillsInitialized]);

  const handleChangeTitle = (index, value) => {
    const updated = [...skills];
    updated[index].title = value;
    updated[index].saved = false;
    setSkills(updated);

    setResumeInfo((prev) => ({
      ...prev,
      skills: updated.map(({ ...rest }) => rest),
    }));
    enableNext(false);
  };

  const handleChangeItems = (index, tags) => {
    const updated = [...skills];
    updated[index].items = tags;
    updated[index].saved = false;
    setSkills(updated);

    setResumeInfo((prev) => ({
      ...prev,
      skills: updated.map(({ ...rest }) => rest),
    }));
    enableNext(false);
  };

  // const handleChange = (index, e) => {
  //   const { name, value } = e.target;
  //   const updated = [...skills];
  //   // if (updated[index][field] === value) return;
  //   updated[index][name] = value;
  //   updated[index].saved = false;
  //   setSkills(updated);

  //   // const cleanData = updated.map(({ ...rest }) => rest);
  //   setResumeInfo((prev) => ({
  //     ...prev,
  //     skills: updated.map((item) => ({ ...item })),
  //   }));
  //   enableNext(false);
  // };

  const handleAddSkillGroup = () => {
    const last = skills[skills.length - 1];
    if (!last.saved) return;
    setSkills([
      ...skills,
      {
        id: Date.now() + Math.random(),
        title: "",
        items: [],
        saved: false,
        isNew: true,
      },
    ]);
  };

  const handleRemoveSkillGroup = (id) => {
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    const cleanData = updated.map(({ ...rest }) => rest);
    setResumeInfo((prev) => ({ ...prev, skills: cleanData }));
    enableNext(false);
  };

  const handleSubmit = () => {
    setSaving(true);
    const updated = skills.map((s) => ({ ...s, saved: true }));
    setSkills(updated);

    const payload = {
      data: {
        skills: updated.map(({ ...rest }) => rest),
      },
    };

    GlobalApi.UpdateResumeDetails(params?.resumeId, payload)
      .then(() => {
        toast.success("Skills updated!");
        setResumeInfo((prev) => ({
          ...prev,
          skills: payload.data.skills,
        }));
        enableNext(true);
      })
      .catch(() => {
        toast.error("Failed to update skills.");
      })
      .finally(() => setSaving(false));
  };

  return (
    <div
      className="p-5 shadow-lg rounded-lg border-t-purple-500 mt-5"
      style={{ borderTopWidth: "5px" }}
    >
      <div className="max-w-xl mx-auto pb-3">
        <h2 className="font-bold text-lg">Skills</h2>
        <p>Add your categorized skills (e.g., Languages, Frameworks, Tools)</p>
      </div>

      <form
        className="space-y-4 max-w-xl mx-auto"
        onSubmit={(e) => e.preventDefault()}
      >
        {skills.map((skill, idx) => (
          <div key={skill.id} className="space-y-4 p-4 border rounded-lg">
            <div className="grid gap-2">
              <Label>Category Title *</Label>
              <Input
                value={skill.title}
                onChange={(e) => handleChangeTitle(idx, e.target.value)}
                placeholder="e.g., Languages"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Skills *</Label>
              <TagsInput
                value={Array.isArray(skill.items) ? skill.items : []}
                onChange={(tags) => handleChangeItems(idx, tags)}
                name={`skills-${skill.id}`}
                placeHolder="Enter a skill"
              />
            </div>

            {skill.isNew && skills.length > 1 && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleRemoveSkillGroup(skill.id)}
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
            onClick={handleAddSkillGroup}
            disabled={!skills[skills.length - 1].saved}
          >
            <Plus className="mr-1" />
            Add More Skills
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SkillsForm;
