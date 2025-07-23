// paginateElements.js
import React from "react";
// import * as ReactDOM from "react-dom/client";
import ReactDOM from "react-dom/client";
// import { render } from "react-dom";
// You can tweak this value if padding or borders add extra height
const DEFAULT_WIDTH_PX = 720; // A4 width

export async function paginateElements(
  elements,
  pageHeightPx,
  setPages,
  setTotalPages,
  setCurrentPage
) {
  const temp = document.createElement("div");
  temp.style.cssText = `
    width: ${DEFAULT_WIDTH_PX}px;
    position: absolute;
    visibility: hidden;
    top: -9999px;
    left: 0;
    background: white;
    font-size: 10px;
    padding: 40px;
    box-sizing: border-box;
  `;
  document.body.appendChild(temp);

  const pages = [];
  let current = [];
  let currentHeight = 0;

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    // Create container to render the element
    const container = document.createElement("div");
    temp.appendChild(container);
    const root = ReactDOM.createRoot(container);
    root.render(el);

    // Wait for DOM to update
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const node = container.firstChild;
    let elHeight = node?.getBoundingClientRect().height || 0;

    // Check if adding this element will overflow
    if (currentHeight + elHeight > pageHeightPx) {
      // Handle orphan header logic
      const last = current[current.length - 1];
      const isHeader =
        last?.type?.name === "SectionHeader" ||
        last?.type?.displayName === "SectionHeader";

      const carry = isHeader ? [last] : [];

      if (isHeader) current.pop(); // Remove orphan header from previous page
      if (current.length > 0) pages.push(current);

      current = [...carry, el];
      currentHeight = carry.length ? elHeight + currentHeight : elHeight;

      // Reset temp container
      temp.innerHTML = ""; // faster
      temp.appendChild(container);
    } else {
      current.push(el);
      currentHeight += elHeight;
    }
  }

  // Push last page
  if (current.length) {
    pages.push(current);
  }

  document.body.removeChild(temp);
  setPages(pages);
  setTotalPages(pages.length);
  setCurrentPage(0);
}
