// components/Resume/Entry/SkillEntry.jsx
import React from "react";
import { getFontSizes } from "../../../utility/fontSizes";

export default function SkillEntry({ skill, themeColor, zoomLevel }) {
  const { text } = getFontSizes(zoomLevel);
  return (
    <li
      className={`text-start font-medium ${text}`}
      style={{ color: themeColor }}
    >
      {skill}
    </li>
  );
}
