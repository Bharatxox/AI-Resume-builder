import React, { useState } from "react";
import { Button } from "../ui/button";
import { LayoutGrid, X } from "lucide-react";

const ThemeSelector = ({ themeColor, setThemeColor }) => {
  const [showPalette, setShowPalette] = useState(false);
  const originalColor = "#00b894"; // your default themeColor

  const colors = [
    { name: "Red", hex: "#e74c3c" },
    { name: "Green", hex: "#27ae60" },
    { name: "Blue", hex: "#2980b9" },
    { name: "Purple", hex: "#8e44ad" },
    { name: "Orange", hex: "#e67e22" },
  ];

  return (
    <div className="relative transition-all duration-300">
      {/* Toggle Button */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          showPalette
            ? "opacity-0 scale-95 pointer-events-none"
            : "opacity-100 scale-100"
        }`}
      >
        <Button
          onClick={() => setShowPalette(true)}
          className="flex items-center gap-2 "
          style={{
            color: "white",
            backgroundColor: showPalette ? "transparent" : themeColor,
          }}
        >
          <LayoutGrid />
          Theme
        </Button>
      </div>

      {/* Color Palette */}
      <div
        className={`absolute top-0 left-0 z-10 flex items-center gap-2 p-2 bg-white shadow-md rounded-md border transition-all duration-300 transform ${
          showPalette
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => {
              setThemeColor(color.hex);
              setShowPalette(false);
            }}
            className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform"
            style={{
              backgroundColor: color.hex,
              transform: themeColor === color.hex ? "scale(1.15)" : "scale(1)",
              opacity: themeColor === color.hex ? 1 : 0.7,
            }}
            title={color.name}
          />
        ))}

        <button
          onClick={() => {
            setShowPalette(false);
            setThemeColor(originalColor); // optional
          }}
          className="ml-2 text-gray-600 hover:text-red-600 cursor-pointer transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ThemeSelector;
