export type Point = [number, number];

export function inverseSigmoid(z: number): number {
  const x = Math.min(Math.max(z, 0.01), 0.99);
  return Math.log(x / (1 - x));
}

export function getField(steps: number = 20): Point[][] {
  const field = [];
  for (let y = 0; y <= steps; y++) {
    const row: Point[] = [];
    let value = inverseSigmoid(y / steps);
    for (let x = 0; x <= steps; x++) {
      row[x] = [inverseSigmoid(x / steps), value];
    }
    field[y] = row;
  }
  return field;
}
