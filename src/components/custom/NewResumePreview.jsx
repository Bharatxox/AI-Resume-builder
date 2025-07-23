import React, { useContext, useEffect, useState, useMemo } from "react";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import { flattenResumeSections } from "./flattenResumeSections";
import { paginateElements } from "../../utility/paginateElements";
// import { groupBullets } from "../../utility/groupBullets";

const A4_HEIGHT_PX = 720; // 297mm

const SectionHeader = ({ children }) => (
  <h2 className="text-xl font-semibold mb-2">{children}</h2>
);

const splitDescription = (desc) =>
  desc
    ? desc.split(/\n+/).map((line, i) => (
        <p key={i} className="mt-1 text-gray-700 text-sm whitespace-pre-line">
          {line}
        </p>
      ))
    : [];

const ResumePreview = ({
  currentPage,
  setCurrentPage,
  setTotalPages,
  zoomLevel,
}) => {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [pages, setPages] = useState([]);

  // ✅ Memoize flattened resume elements
  const elements = useMemo(() => {
    if (!resumeInfo) return [];
    return flattenResumeSections(resumeInfo, zoomLevel);
  }, [resumeInfo, zoomLevel]);

  // ✅ Trigger pagination only when elements change
  useEffect(() => {
    if (!elements.length) return;
    paginateElements(
      elements,
      A4_HEIGHT_PX,
      setPages,
      setTotalPages,
      setCurrentPage
    );
  }, [elements, setPages, setTotalPages, setCurrentPage]);

  return (
    <div
      className={`mx-auto shadow-md overflow-hidden bg-white p-8 ${
        zoomLevel === "large"
          ? "w-[210mm] h-[297mm] text-[10px]"
          : "w-[130mm] h-[175mm] text-[8px]"
      }`}
    >
      {(pages[currentPage] || []).map((section, idx) => (
        <React.Fragment key={idx}>{section}</React.Fragment>
      ))}
    </div>
  );
};

export default ResumePreview;
