import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Label } from "../../ui/label";
import { TagsInput } from "react-tag-input-component";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import GlobalApi from "../../../../service/GlobalApi";
import { Checkbox } from "../../ui/checkbox";

const LanguageForm = ({ enableNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();

  const [languages, setLanguages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [skip, setSkip] = useState(false);

  // useEffect(() => {
  //   enableNext(false);
  // }, []);

  // useEffect(() => {
  //   if (skip) {
  //     setLanguages([]); // Clear UI state
  //     setResumeInfo((prev) => ({
  //       ...prev,
  //       languages: [],
  //     }));
  //   }
  // }, [skip]);

  useEffect(() => {
    if (resumeInfo?.languages) {
      setLanguages(resumeInfo.languages);
    }
  }, []);

  const handleSubmit = () => {
    // enableNext(true); //change this later when i update the database in STRAPI ///////////////////////////////////////////////////////////
    setSaving(true);

    const payload = {
      data: {
        languages,
      },
    };

    GlobalApi.UpdateResumeDetails(params?.resumeId, payload)
      .then(() => {
        toast.success("Languages updated!");
        setResumeInfo((prev) => ({ ...prev, languages }));
        enableNext(true);
      })
      .catch(() => toast.error("Failed to update languages."))
      .finally(() => {
        setSaving(false);
        enableNext(true);
      });
  };

  return (
    <div
      className="p-5 shadow-lg rounded-lg border-t-blue-500 mt-5"
      style={{ borderTopWidth: "5px" }}
    >
      <div className="max-w-xl mx-auto flex justify-between items-start">
        <div>
          <h2 className="font-bold text-lg">Languages</h2>
          <p>List the languages you can speak or write</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Checkbox
            checked={skip}
            onCheckedChange={(checked) => {
              setSkip(checked);
              enableNext(checked);

              if (checked) {
                // setLanguages([]); // Clear UI
                setResumeInfo((prev) => ({
                  ...prev,
                  languages: [], // Clear Context
                }));
              }

              // Allow "Next" immediately if skipped
            }}
          />

          <Label>Skip this section</Label>
        </div>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-4 max-w-xl mx-auto"
      >
        <div className="grid gap-2">
          <Label>Languages</Label>
          <TagsInput
            value={languages}
            onChange={(tags) => {
              setLanguages(tags);
              setResumeInfo((prev) => ({ ...prev, languages: tags }));
              enableNext(false);
            }}
            name="languages"
            placeHolder="e.g., English, Hindi"
            disabled={skip}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving || skip}
          >
            {saving ? <Loader2 className="animate-spin mr-2" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LanguageForm;
