const PersonalDetail = ({ resumeInfo }) => {
  const { firstName, lastName, address, phone, email, social } =
    resumeInfo || {};

  return (
    <div className="text-center space-y-1">
      <h2 className="font-bold text-2xl">
        {firstName} {lastName}
      </h2>
      <div className="flex text-center justify-center gap-2">
        <p className="text-sm">{address} |</p>
        <p className="text-sm">
          <a href={`mailto:${email}`} className="text-blue-600 underline">
            {email}
          </a>{" "}
          | {phone}
        </p>
      </div>
      <p className="text-sm  flex justify-center gap-2">
        {social?.linkedin && (
          <a href={social?.linkedin} className="text-blue-600 underline">
            LinkedIn
          </a>
        )}
        {"|"}
        {social?.github && (
          <a href={social?.github} className="text-blue-600 underline">
            GitHub
          </a>
        )}
      </p>
    </div>
  );
};

export default PersonalDetail;
