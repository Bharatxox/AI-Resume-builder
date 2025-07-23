import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "./FormSection";
import ResumePreview from "./NewResumePreview";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import GlobalApi from "../../../service/GlobalApi";
import StartupModal from "./StartupCard";
import { Button } from "../ui/button";
import {
  ArrowLeft,
  ArrowRight,
  FileDownIcon,
  LucideCloudCheck,
  MoreHorizontalIcon,
} from "lucide-react";
import { AspectRatio } from "../ui/aspect-ratio";

const EditResume = () => {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState("small");
  // const totalPages = pages.length;

  useEffect(() => {
    GetResumeInfo();
  }, []);

  // useEffect(() => {
  //   setTotalPages(pages.length);
  // }, [pages]);

  const GetResumeInfo = () => {
    GlobalApi.GetResumeBuId(resumeId)
      .then((response) => {
        console.log("DATA:", response.data.data);
        setResumeInfo(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching resume data:", error);
        setLoading(false);
      });
  };

  const isResumeEmpty = (info) => {
    return (
      (!info.firstName || info.firstName.trim() === "") &&
      (!info.lastName || info.lastName.trim() === "") &&
      (!info.summary || info.summary.trim() === "") &&
      (!info.education || info.education.length === 0) &&
      (!info.skills || info.skills.length === 0) &&
      (!info.experience || info.experience.length === 0)
      // add more fields as you want
    );
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div>
        {!loading && resumeInfo && isResumeEmpty(resumeInfo) && (
          <StartupModal />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Form Section */}
          <div className="bg-white p-6">
            <FormSection />
          </div>
          {/* Preview Section */}
          <div className="bg-slate-100 p-6 px-30 h-screen overflow-y-auto">
            <div className="flex justify-end gap-2 mb-4">
              <Button>
                Downlode <FileDownIcon />
              </Button>
              <Button>
                <MoreHorizontalIcon />
              </Button>
            </div>
            <div>
              <Button onClick={() => setZoomLevel("small")}>Small View</Button>
              <Button onClick={() => setZoomLevel("large")}>Full View</Button>
            </div>
            <div>
              <ResumePreview
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setTotalPages={setTotalPages}
                zoomLevel={zoomLevel}
              />
            </div>
            <div className="flex  items-center relative justify-center mt-3">
              {/* <div className="absolute left-1 flex items-center gap-1 mt-4 text-slate-500">
                <LucideCloudCheck />
                <p className="font-semibold">Saved</p>
              </div> */}
              <div className="flex gap-2 items-center font-medium ">
                <ArrowLeft
                  className="w-4 h-4 text-slate-500 hover:text-slate-600 cursor-pointer"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                />
                <div className="flex items-center gap-1 text-slate-500 ">
                  <p>{currentPage + 1}</p>
                  <p>/</p>
                  <p>{totalPages}</p>{" "}
                  {/* You can update this later from ResumePreview */}
                </div>
                <ArrowRight
                  className="w-4 h-4 text-slate-500 hover:text-slate-600 cursor-pointer"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default EditResume;
