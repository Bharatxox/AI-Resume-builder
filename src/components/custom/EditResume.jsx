import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "./FormSection";
import ResumePreview from "./ResumePreview";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import dummy2 from "../../data/dummy2";

const EditResume = () => {
  const params = useParams();
  const [resumeInfo, setResumeInfo] = useState(dummy2);

  useEffect(() => {
    setResumeInfo(dummy2);
    console.log(params.resumeId);
  }, []);

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
