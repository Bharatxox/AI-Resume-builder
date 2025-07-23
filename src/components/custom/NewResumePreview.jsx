import React, { useRef, useEffect, useState, useContext } from "react";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import { format } from "date-fns";
import { getFontSizes } from "../../utility/fontSizes";
import splitDescription from "../../utility/splitDescription"; // Your utility returns <li> elements

// Your SectionHeader component is still useful as a standalone element
import SectionHeader from "./Section/SectionHeader";

const PAGE_HEIGHT_PX = 510; // New total page height from your code
const VISIBLE_PAGE_VERTICAL_PADDING_PX = 64; // Assuming p-8 is 32px top + 32px bottom = 64px
const USABLE_PAGE_HEIGHT_PX = PAGE_HEIGHT_PX - VISIBLE_PAGE_VERTICAL_PADDING_PX;

const ResumePreview = ({
  currentPage,
  setCurrentPage,
  setTotalPages,
  zoomLevel,
}) => {
  const { resumeInfo } = useContext(ResumeInfoContext);

  // Destructure resumeInfo based on your AI-Resume-builder's data structure
  // Personal details are now accessed directly from resumeInfo
  // Work experience array is named 'experience'
  const {
    summary = "",
    experience = [], // Corrected: using 'experience' for work experience data
    education = [],
    projects = [],
    skills = [],
    certification = [],
    hobbies = [],
    languages = [],
    // firstName, lastName, address, phone, email, linkedin, github
    // are now expected directly on resumeInfo for inlined PersonalDetail
  } = resumeInfo || {};

  const allBlocks = [
    // --- PersonalDetail Section ---
    {
      key: "personalDetail",
      jsx: (
        <div className={`text-center ${getFontSizes(zoomLevel).text}`}>
          <h2 className={`font-bold ${getFontSizes(zoomLevel).mainHeading}`}>
            {resumeInfo?.firstName} {resumeInfo?.lastName}
          </h2>
          <div
            className={`flex flex-wrap justify-center gap-x-1 text-center px-15`}
          >
            {[
              resumeInfo?.address,
              resumeInfo?.email && (
                <a
                  href={`mailto:${resumeInfo.email}`}
                  className="text-blue-600 underline"
                >
                  {resumeInfo?.email}
                </a>
              ),
              resumeInfo?.phone,
              resumeInfo?.linkedin && (
                <a
                  href={resumeInfo?.linkedin}
                  className="text-blue-600 underline"
                >
                  LinkedIn
                </a>
              ),
              resumeInfo?.github && (
                <a
                  href={resumeInfo?.github}
                  className="text-blue-600 underline"
                >
                  GitHub
                </a>
              ),
            ]
              .filter(Boolean)
              .map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="text-gray-400">|</span>}
                  <span>{item}</span>
                </React.Fragment>
              ))}
          </div>
        </div>
      ),
    },

    // --- Summary Section ---
    ...(summary && summary.trim() !== ""
      ? [
          {
            key: "summary-header",
            jsx: <SectionHeader title="Summary" zoomLevel={zoomLevel} />,
          },
          {
            key: "summary",
            jsx: (
              <section className={`${getFontSizes(zoomLevel).text}`}>
                <p>{summary}</p>
              </section>
            ),
          },
        ]
      : []),

    // --- Work Experience Section ---
    ...(experience.length
      ? [
          {
            key: "work-header",
            jsx: (
              <SectionHeader title="Work Experience" zoomLevel={zoomLevel} />
            ),
          },
          ...experience
            .map((exp, idx) => {
              const bullets = splitDescription(exp.workSummary, zoomLevel);
              return [
                {
                  key: `work-${idx}-meta`,
                  jsx: (
                    <div key={exp.id || `exp-meta-${idx}`} className="mb-1">
                      <div className="flex justify-between">
                        <h3
                          className={`font-semibold ${
                            getFontSizes(zoomLevel).subheading
                          }`}
                        >
                          {exp.title}, {exp.companyName}
                        </h3>
                        <p className={`italic ${getFontSizes(zoomLevel).text}`}>
                          {exp.startDate
                            ? format(new Date(exp.startDate), "MMM yyyy")
                            : ""}{" "}
                          –{" "}
                          {exp.currentlyWorking
                            ? "Present"
                            : exp.endDate
                            ? format(new Date(exp.endDate), "MMM yyyy")
                            : ""}
                        </p>
                      </div>
                      <p className={`italic ${getFontSizes(zoomLevel).text}`}>
                        {exp.city}, {exp.state}
                      </p>
                    </div>
                  ),
                },
                ...bullets.map((li_jsx, li_idx) => ({
                  key: `work-${idx}-bullet-${li_idx}`,
                  jsx: <ul className="list-disc pl-6 mb-1">{li_jsx}</ul>,
                })),
              ];
            })
            .flat(),
        ]
      : []),

    // --- Education Section ---
    ...(education.length
      ? [
          {
            key: "education-header",
            jsx: <SectionHeader title="Education" zoomLevel={zoomLevel} />,
          },
          ...education
            .map((edu, idx) => {
              return [
                {
                  key: `edu-${idx}-meta`,
                  jsx: (
                    <div key={edu.id || `edu-meta-${idx}`} className="mb-1">
                      <div className="flex justify-between">
                        <h3
                          className={`font-medium ${
                            getFontSizes(zoomLevel).subheading
                          }`}
                        >
                          {edu.degree}, {edu.major}
                        </h3>
                        <p className="italic">
                          {edu.startDate
                            ? format(new Date(edu.startDate), "MMM yyyy")
                            : ""}{" "}
                          –{" "}
                          {edu.currentlyWorking
                            ? "Present"
                            : edu.endDate
                            ? format(new Date(edu.endDate), "MMM-yyyy")
                            : ""}
                        </p>
                      </div>
                      <p className="italic">{edu.universityName}</p>
                      {edu.cgpa && (
                        <p className="font-medium">CGPA: {edu.cgpa}</p>
                      )}
                      {edu.percentage && <p>Percentage: {edu.percentage}%</p>}
                      {edu.description && <p>{edu.description}</p>}
                    </div>
                  ),
                },
              ];
            })
            .flat(),
        ]
      : []),

    // --- Projects Section ---
    ...(projects.length
      ? [
          {
            key: "projects-header",
            jsx: <SectionHeader title="Projects" zoomLevel={zoomLevel} />,
          },
          ...projects
            .map((project, idx) => {
              const bullets = splitDescription(project.description, zoomLevel);
              return [
                {
                  key: `proj-${idx}-meta`,
                  jsx: (
                    <div
                      key={project.id || `proj-meta-${idx}`}
                      className="mb-1"
                    >
                      <div className="flex justify-between">
                        <h3
                          className={`font-medium ${
                            getFontSizes(zoomLevel).subheading
                          }`}
                        >
                          {project.title}
                        </h3>
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
                    </div>
                  ),
                },
                ...bullets.map((li_jsx, li_idx) => ({
                  key: `proj-${idx}-bullet-${li_idx}`,
                  jsx: <ul className="list-disc pl-6 mb-1">{li_jsx}</ul>,
                })),
              ];
            })
            .flat(),
        ]
      : []),

    // --- Skills Section ---
    ...(skills.length
      ? [
          {
            key: "skills-header",
            jsx: <SectionHeader title="Skills" zoomLevel={zoomLevel} />,
          },
          ...skills
            .map((group, group_idx) => [
              {
                key: `skills-group-${group_idx}-title`,
                jsx: (
                  <div
                    key={`group-title-${group_idx}`}
                    className="flex flex-col items-start"
                  >
                    <h3
                      className={`font-semibold ${
                        getFontSizes(zoomLevel).subheading
                      }`}
                    >
                      {group.title}
                    </h3>
                  </div>
                ),
              },
              ...(group?.items?.map((skill, skill_idx) => ({
                key: `skills-${group_idx}-item-${skill_idx}`,
                jsx: (
                  <ul className="list-disc pl-4 leading-2.5 mb-1">
                    <li
                      className={`text-start font-medium ${
                        getFontSizes(zoomLevel).text
                      }`}
                      key={skill_idx}
                    >
                      {skill}
                    </li>
                  </ul>
                ),
              })) || []),
            ])
            .flat(),
        ]
      : []),

    // --- Certification Section ---
    ...(certification.length
      ? [
          {
            key: "certification-header",
            jsx: <SectionHeader title="Certifications" zoomLevel={zoomLevel} />,
          },
          ...certification
            .map((cert, idx) => {
              const bullets = splitDescription(cert.description, zoomLevel);
              return [
                {
                  key: `cert-${idx}-meta`,
                  jsx: (
                    <div key={cert.id || `cert-meta-${idx}`} className="mb-1">
                      <div className="flex justify-between">
                        <h3
                          className={`font-medium ${
                            getFontSizes(zoomLevel).subheading
                          }`}
                        >
                          {cert.title}
                        </h3>
                        <p className="italic">
                          {cert.startDate
                            ? format(new Date(cert.startDate), "MMM-yyyy")
                            : ""}{" "}
                          –{" "}
                          {cert.currentlyWorking
                            ? "Present"
                            : cert.endDate
                            ? format(new Date(cert.endDate), "MMM-yyyy")
                            : ""}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>{cert.organization}</p>
                        {cert.link && (
                          <a
                            href={cert.link}
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  ),
                },
                ...bullets.map((li_jsx, li_idx) => ({
                  key: `cert-${idx}-bullet-${li_idx}`,
                  jsx: <ul className="list-disc pl-6 mb-1">{li_jsx}</ul>,
                })),
              ];
            })
            .flat(),
        ]
      : []),

    // --- Hobbies Section ---
    ...(hobbies.length
      ? [
          {
            key: "hobbies-header",
            jsx: <SectionHeader title="Hobbies" zoomLevel={zoomLevel} />,
          },
          ...hobbies.map((hobby, idx) => ({
            key: `hobby-${idx}`,
            jsx: (
              <ul className="list-disc pl-6 mb-1">
                <li key={idx}>{hobby}</li>
              </ul>
            ),
          })),
        ]
      : []),

    // --- Languages Section ---
    ...(languages.length
      ? [
          {
            key: "languages-header",
            jsx: <SectionHeader title="Languages" zoomLevel={zoomLevel} />,
          },
          ...languages.map((lang, idx) => ({
            key: `lang-${idx}`,
            jsx: (
              <ul className="list-disc pl-6 mb-1">
                <li key={idx}>{lang}</li>
              </ul>
            ),
          })),
        ]
      : []),
  ];

  const blockRefs = useRef([]);
  blockRefs.current = allBlocks.map(
    (_, i) => blockRefs.current[i] ?? React.createRef()
  );

  const [pages, setPages] = useState([[]]);

  useEffect(() => {
    if (!resumeInfo || Object.keys(resumeInfo).length === 0) {
      setPages([[]]);
      setTotalPages(1);
      setCurrentPage(0);
      return;
    }

    setTimeout(() => {
      let currentHeight = 0;
      let current = [];
      const paginated = [];

      for (let i = 0; i < allBlocks.length; i++) {
        const ref = blockRefs.current[i];
        const el = ref.current;
        if (!el) continue;
        const blockHeight = el.offsetHeight;

        if (
          allBlocks[i].key.endsWith("header") &&
          i + 1 < allBlocks.length &&
          currentHeight +
            blockHeight +
            (blockRefs.current[i + 1]?.current?.offsetHeight || 0) >
            USABLE_PAGE_HEIGHT_PX
        ) {
          paginated.push(current);
          current = [];
          currentHeight = 0;
        }

        if (
          currentHeight + blockHeight > USABLE_PAGE_HEIGHT_PX &&
          current.length > 0
        ) {
          paginated.push(current);
          current = [];
          currentHeight = 0;
        }

        current.push(allBlocks[i].jsx);
        currentHeight += blockHeight;
      }

      if (current.length > 0) paginated.push(current);

      setPages(paginated);
      setTotalPages(paginated.length);
      setCurrentPage(0);
    }, 100);
  }, [
    resumeInfo,
    setTotalPages,
    setCurrentPage,
    // Corrected dependencies to match destructured variables
    summary,
    experience,
    education,
    projects,
    skills,
    certification,
    hobbies,
    languages,
  ]);

  return (
    <>
      <div
        style={{
          visibility: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          width: "122mm",
          fontSize: zoomLevel === "large" ? "10px" : "8px",
        }}
      >
        {allBlocks.map((block, idx) => (
          <div key={block.key} ref={blockRefs.current[idx]}>
            {block.jsx}
          </div>
        ))}
      </div>

      <div
        className={`w-full max-w-[122mm] h-[173mm] bg-white shadow-md mx-auto p-8 rounded-md border border-gray-200 overflow-hidden flex flex-col`}
        style={{
          minHeight: `${PAGE_HEIGHT_PX}px`,
          // height: "auto", // Allow height to be determined by aspect-ratio and content
          aspectRatio: "210 / 297", // A4 aspect ratio (width / height)
          fontSize: zoomLevel === "large" ? "10px" : "8px",
        }}
      >
        {pages[currentPage] &&
          pages[currentPage].map((content, idx) => (
            <React.Fragment key={idx}>{content}</React.Fragment>
          ))}
      </div>
    </>
  );
};

export default ResumePreview;
