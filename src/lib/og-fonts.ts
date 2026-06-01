import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const fontDir = join(process.cwd(), 'public/arad/og');

type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 600 | 700;
  style: 'normal';
};

let fontsPromise: Promise<OgFont[]> | null = null;

async function loadFont(file: string, weight: OgFont['weight']): Promise<OgFont> {
  return {
    name: 'Arad',
    data: await readFile(join(fontDir, file)),
    weight,
    style: 'normal',
  };
}

export function getOgFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      loadFont('Arad-Regular.ttf', 400),
      loadFont('Arad-SemiBold.ttf', 600),
      loadFont('Arad-Bold.ttf', 700),
    ]);
  }

  return fontsPromise;
}
