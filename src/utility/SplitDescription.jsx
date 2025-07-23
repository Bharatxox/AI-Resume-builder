const splitDescription = (desc) =>
  desc
    ? desc.split(/\n+/).map((line, i) => (
        <li key={i} className="mt-1 text-gray-700 text-sm whitespace-pre-line">
          {line}
        </li>
      ))
    : [];

export default splitDescription;
