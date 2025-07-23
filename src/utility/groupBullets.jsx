export function groupBullets(elements) {
  const result = [];
  let buffer = [];

  elements.forEach((el, idx) => {
    if (el?.type === "li") {
      buffer.push(el);
    } else {
      if (buffer.length) {
        result.push(
          <ul className="pl-6 list-disc" key={`ul-${idx}`}>
            {buffer}
          </ul>
        );
        buffer = [];
      }
      result.push(el);
    }
  });

  if (buffer.length) {
    result.push(
      <ul className="pl-6 list-disc" key={`ul-final`}>
        {buffer}
      </ul>
    );
  }

  return result;
}
