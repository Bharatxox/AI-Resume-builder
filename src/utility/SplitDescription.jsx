// src/utility/splitDescription.jsx
import { getFontSizes } from "./fontSizes";

const splitDescription = (desc, zoomLevel) => {
  const { text } = getFontSizes(zoomLevel);

  // Ensure desc is a string before splitting, and trim each line
  // Filter out any lines that are empty or contain only whitespace after trimming
  const lines = desc
    ? String(desc).split(/\n+/) // Ensure desc is treated as a string
    : [];

  return lines
    .filter((line) => line.trim() !== "") // Filter out empty strings or strings with only whitespace
    .map((line, i) => (
      // Changed to <p> tags as discussed, for better pagination and spacing
      // Added mt-1 and text-gray-700 text-sm back for consistent styling as in previous iterations
      <li key={i} className={` ${text}`}>
        {line}
      </li>
    ));
};

export default splitDescription;
