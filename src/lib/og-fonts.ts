import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const fontDir = join(process.cwd(), 'public/arad');

type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 600 | 700;
  style: 'normal';
};

let fontsPromise: Promise<OgFont[]> | null = null;

export function getOgFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      readFile(join(fontDir, 'Arad-Regular.woff2')),
      readFile(join(fontDir, 'Arad-SemiBold.woff2')),
      readFile(join(fontDir, 'Arad-Bold.woff2')),
    ]).then(([regular, semibold, bold]) => [
      {
        name: 'Arad',
        data: regular,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Arad',
        data: semibold,
        weight: 600,
        style: 'normal',
      },
      {
        name: 'Arad',
        data: bold,
        weight: 700,
        style: 'normal',
      },
    ]);
  }

  return fontsPromise;
}
