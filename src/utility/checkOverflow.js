import * as ReactDOM from "react-dom/client";

/**
 * Renders all elements into a hidden container and checks if their total height
 * exceeds the specified pageHeightPx. Returns true if overflow detected.
 */
export async function checkOverflow(elements, pageHeightPx) {
  const temp = document.createElement("div");
  temp.style.cssText = `
    width: 644px;
    height: auto;
    position: absolute;
    visibility: hidden;
    top: -9999px;
    left: -9999px;
    padding: 40px;
    box-sizing: border-box;
    background: white;
    z-index: -9999;
  `;
  document.body.appendChild(temp);

  // Render all elements
  for (let el of elements) {
    const container = document.createElement("div");
    temp.appendChild(container);
    const root = ReactDOM.createRoot(container);
    root.render(el);
  }

  // Wait for DOM to update
  await new Promise((resolve) => setTimeout(resolve, 50));

  const isOverflow = temp.scrollHeight > pageHeightPx;

  document.body.removeChild(temp);

  return isOverflow;
}
