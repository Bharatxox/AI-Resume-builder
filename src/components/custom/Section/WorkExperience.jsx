import { format } from "date-fns";

const WorkExperience = ({ experience, themeColor }) => {
  return (
    <section>
      {experience?.length > 0 && (
        <h2
          className="text-xl font-semibold pb-2 mb-2 border-b-2 pt-4"
          style={{ color: themeColor }}
        >
          Work Experience
        </h2>
      )}
      {experience?.map((exp) => (
        <div key={exp.id} className="mb-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">
              {exp.title}, {exp.companyName}
            </h3>
            <p className="italic">
              {exp.startDate ? format(new Date(exp.startDate), "MMM yyyy") : ""}{" "}
              –{" "}
              {exp.currentlyWorking
                ? "Present"
                : exp.endDate
                ? format(new Date(exp.endDate), "MMM yyyy")
                : ""}
            </p>
          </div>
          <p className="italic flex justify-between">
            <p>
              {exp.city}, {exp.state}
            </p>{" "}
          </p>
          <ul className="list-disc pl-6">
            {exp.workSummary
              .split("\n")
              .filter((point) => point.trim() !== "")
              .map((point, i) => (
                <li key={i}>{point}</li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default WorkExperience;
