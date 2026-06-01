import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import wawoff2 from 'wawoff2';

const fontDir = join(process.cwd(), 'public/arad');

type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 600 | 700;
  style: 'normal';
};

let fontsPromise: Promise<OgFont[]> | null = null;

async function loadFont(file: string, weight: OgFont['weight']): Promise<OgFont> {
  const woff2 = await readFile(join(fontDir, file));
  const data = Buffer.from(await wawoff2.decompress(woff2));

  return {
    name: 'Arad',
    data,
    weight,
    style: 'normal',
  };
}

export function getOgFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      loadFont('Arad-Regular.woff2', 400),
      loadFont('Arad-SemiBold.woff2', 600),
      loadFont('Arad-Bold.woff2', 700),
    ]);
  }

  return fontsPromise;
}
