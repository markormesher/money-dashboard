function transformCoord(m: DOMMatrix, x: number, y: number): { x: number; y: number } {
  return {
    x: x * m.a + y * m.c + m.e,
    y: x * m.b + y * m.d + m.f,
  };
}

function getTransformedBBox(el: SVGGraphicsElement): DOMRect {
  const matrix = el.getCTM();
  const bounds = el.getBBox();
  const transformedPoints = [
    transformCoord(matrix, bounds.x, bounds.y),
    transformCoord(matrix, bounds.x + bounds.width, bounds.y),
    transformCoord(matrix, bounds.x + bounds.width, bounds.y + bounds.height),
    transformCoord(matrix, bounds.x, bounds.y + bounds.height),
  ];
  const leftXCoord = Math.min(...transformedPoints.map((p) => p.x));
  const rightXCoord = Math.max(...transformedPoints.map((p) => p.x));
  const topYCoord = Math.min(...transformedPoints.map((p) => p.y));
  const bottomYCoord = Math.max(...transformedPoints.map((p) => p.y));
  return new DOMRect(leftXCoord, topYCoord, rightXCoord - leftXCoord, bottomYCoord - topYCoord);
}

function generateTickValues(min: number, max: number, step: number): number[] {
  const output: number[] = [];
  // using the count guarantees we get the right amount of steps, rather than looping from $min to $max in $step
  // increments, which can result in the last tick being missed because of problems with floating point precision
  // (i.e. the same problem that causes 0.1 + 0.2 = 0.30000000000000004)
  const stepCount = Math.ceil((max - min) / step) + 1;
  for (let i = 0; i < stepCount; ++i) {
    output.push(min + step * i);
  }
  return output;
}

export { getTransformedBBox, generateTickValues };
