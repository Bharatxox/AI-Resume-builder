import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import GlobalApi from "../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const PersonalDetailForm = ({ enableNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    address: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
  });

  // ✅ Populate formData from context on mount
  useEffect(() => {
    if (resumeInfo) {
      setFormData({
        firstName: resumeInfo.firstName || "",
        lastName: resumeInfo.lastName || "",
        jobTitle: resumeInfo.jobTitle || "",
        address: resumeInfo.address || "",
        phone: resumeInfo.phone || "",
        email: resumeInfo.email || "",
        linkedin: resumeInfo.linkedin || "",
        github: resumeInfo.github || "",
      });
    }
  }, [resumeInfo]);

  const handleChange = (e) => {
    enableNext(false);
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 🔁 Update context
    setResumeInfo({
      ...resumeInfo,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      data: { ...formData },
    };

    GlobalApi.UpdateResumeDetails(params?.resumeId, data).then(
      (resp) => {
        console.log("Form submitted", resp);
        enableNext(true);
        setLoading(false);
        toast("Detail Updated");
      },
      (err) => {
        setLoading(false);
        console.log("Error msg", err);
      }
    );
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
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="firstName">
              First Name <span className="text-red-600">*</span>
            </Label>
            <Input
              required
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-red-600">*</span>
            </Label>
            <Input
              required
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="jobTitle">
            Job Title <span className="text-red-600">*</span>
          </Label>
          <Input
            required
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="phone">
              Phone <span className="text-red-600">*</span>
            </Label>
            <Input
              required
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              required
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address">
            Address <span className="text-red-600">*</span>
          </Label>
          <Textarea
            required
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* Optional: LinkedIn and GitHub */}
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetailForm;
