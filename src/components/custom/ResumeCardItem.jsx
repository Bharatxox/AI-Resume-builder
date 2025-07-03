import { Notebook } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const ResumeCardItem = ({ resume }) => {
  return (
    <Link to={"/dashboard/resume/" + resume.documentId + "/edit"}>
      <div>
        <div className="p-14 py-24 border flex items-center justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer ">
          <Notebook />
        </div>
        <h2 className="text-center my-1">{resume.title}</h2>
      </div>
    </Link>
  );
};

export default ResumeCardItem;
