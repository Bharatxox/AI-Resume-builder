import React, { useEffect, useState } from "react";
import {
  X,
  Upload,
  Sparkles,
  FilePlus2,
  FileText,
  FileSearch,
  ArrowRight,
} from "lucide-react"; // You can customize icons

const StartupModal = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  if (!show) return null;

  const options = [
    { icon: FilePlus2, label: "Create new resume" },
    { icon: Sparkles, label: "Create with AI assistance" },
    { icon: Upload, label: "Upload resume" },
    { icon: FileSearch, label: "Create with LinkedIn profile" },
    { icon: FileText, label: "Create from example" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl py-8 px-10 relative">
        <button
          className="absolute top-7 right-7 text-gray-400 hover:text-red-600"
          onClick={() => setShow(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-1">
          Let's get started
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          How do you want to create your resume?
        </p>

        <div className="space-y-3">
          {options.map((option, i) => (
            <button
              key={i}
              className="w-full flex items-center justify-between px-4 py-3 rounded-md bg-gray-100 hover:bg-blue-100 transition  text-gray-800 hover:text-blue-600"
              onClick={() => {
                setShow(false);
                // Trigger relevant action here
              }}
            >
              <div className="flex items-center gap-3 text-sm font-medium">
                <option.icon className="w-5 h-5" />
                {option.label}
              </div>
              <span className="text-gray-400">
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartupModal;
