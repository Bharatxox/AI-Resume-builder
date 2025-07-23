// ProjectEntrySplit.jsx
import React from "react";
import { getFontSizes } from "../../../utility/fontSizes";

export default function ProjectEntry({ project, zoomLevel }) {
  const { subheading, text } = getFontSizes(zoomLevel);
  const bullets =
    project.description?.split("\n").filter((point) => point.trim() !== "") ||
    [];

  return (
    <div key={project.id}>
      <div className="mb-1">
        <div className="flex justify-between">
          <h3 className={`font-semibold ${subheading}`}>{project.title}</h3>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-blue-600 underline ${text}`}
            >
              Link
            </a>
          )}
        </div>
        <p className={`${text}`}>
          Technologies:{" "}
          {Array.isArray(project.technologies)
            ? project.technologies.join(", ")
            : String(project.technologies || "")}
        </p>
      </div>
      {bullets.length > 0 && (
        <ul className="pl-6 list-disc">
          {bullets.map((point, i) => (
            <li key={`bullet-${project.id}-${i}`}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
