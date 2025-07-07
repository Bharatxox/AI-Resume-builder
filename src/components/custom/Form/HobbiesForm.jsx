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

const HobbiesForm = ({ enableNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();

  const [hobbies, setHobbies] = useState([]);
  const [saving, setSaving] = useState(false);
  const [skip, setSkip] = useState(false);

  // useEffect(() => {
  //   enableNext(false);
  // }, []);

  useEffect(() => {
    if (resumeInfo?.hobbies) {
      setHobbies(resumeInfo.hobbies);
    }
  }, []);

  const handleSubmit = () => {
    // enableNext(true); //change this later when i update the database in STRAPI ///////////////////////////////////////////////////////////
    setSaving(true);

    const payload = {
      data: {
        hobbies,
      },
    };

    GlobalApi.UpdateResumeDetails(params?.resumeId, payload)
      .then(() => {
        toast.success("Hobbies updated!");
        setResumeInfo((prev) => ({ ...prev, hobbies }));
        enableNext(true);
      })
      .catch(() => toast.error("Failed to update hobbies."))
      .finally(() => {
        setSaving(false);
        enableNext(true);
      });
  };

  return (
    <div
      className="p-5 shadow-lg rounded-lg border-t-green-500 mt-5"
      style={{ borderTopWidth: "5px" }}
    >
      <div className="max-w-xl mx-auto flex justify-between items-start">
        <div>
          <h2 className="font-bold text-lg">Hobbies</h2>
          <p>Enter your hobbies or interests</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Checkbox
            checked={skip}
            onCheckedChange={(checked) => {
              setSkip(checked);
              enableNext(checked);

              if (checked) {
                // setHobbies([]); // clear local
                setResumeInfo((prev) => ({
                  ...prev,
                  hobbies: [], // clear context
                }));
              }

              // apply immediately based on toggle
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
          <Label>Hobbies</Label>
          <TagsInput
            value={hobbies}
            onChange={(tags) => {
              setHobbies(tags);
              setResumeInfo((prev) => ({ ...prev, hobbies: tags }));
              enableNext(false);
            }}
            name="hobbies"
            placeHolder="e.g., Sketching, Gym"
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

export default HobbiesForm;
