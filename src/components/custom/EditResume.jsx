import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "./FormSection";
import ResumePreview from "./ResumePreview";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import GlobalApi from "../../../service/GlobalApi";

const EditResume = () => {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState();

  useEffect(() => {
    GetResumeInfo();
  }, []);

  const GetResumeInfo = () => {
    GlobalApi.GetResumeBuId(resumeId)
      .then((response) => {
        console.log("DATA:", response.data.data);
        setResumeInfo(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching resume data:", error);
      });
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
          {/* Form Section */}
          <FormSection />
          {/* Preview Section */}
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default EditResume;
