import React from "react";
import { getFontSizes } from "../../../utility/fontSizes"; // adjust path if needed

const ProjectsSection = ({ projects, themeColor, zoomLevel }) => {
  const { heading, subheading, text } = getFontSizes(zoomLevel);

  return (
    <section className={`${text}`}>
      {projects?.length > 0 && (
        <h2
          className={`font-semibold pb-2 mb-2 border-b-2 pt-4 ${heading}`}
          style={{ color: themeColor }}
        >
          Projects
        </h2>
      )}
      {projects?.map((project) => (
        <div key={project.id} className="mb-4">
          <div className="flex justify-between">
            <h3 className={`font-medium ${subheading}`}>{project.title}</h3>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 ml-4"
              >
                Link
              </a>
            )}
          </div>
          <p className="italic">
            {(Array.isArray(project.technologies)
              ? project.technologies
              : typeof project.technologies === "string"
              ? project.technologies.split(",").map((t) => t.trim())
              : []
            ).join(" | ")}
          </p>

          <ul className="list-disc pl-6">
            {project.description
              .split("\n")
              .filter((line) => line.trim() !== "")
              .map((line, i) => (
                <li key={i}>{line}</li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default ProjectsSection;
