export const getFontSizes = (zoomLevel) => ({
  mainHeading: zoomLevel === "large" ? "text-2xl" : "text-[14px]",
  heading: zoomLevel === "large" ? "text-xl" : "text-[11px]",
  subheading: zoomLevel === "large" ? "text-base" : "text-[9px]",
  text: zoomLevel === "large" ? "text-sm" : "text-[8px]",
});
