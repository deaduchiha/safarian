import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import wawoff2 from 'wawoff2';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(root, 'public/arad');
const outputDir = join(root, 'public/arad/og');

const fonts = [
  ['Arad-Regular.woff2', 'Arad-Regular.ttf', 400],
  ['Arad-SemiBold.woff2', 'Arad-SemiBold.ttf', 600],
  ['Arad-Bold.woff2', 'Arad-Bold.ttf', 700],
];

await mkdir(outputDir, { recursive: true });

for (const [source, target] of fonts) {
  const woff2 = await readFile(join(sourceDir, source));
  const ttf = Buffer.from(await wawoff2.decompress(woff2));
  await writeFile(join(outputDir, target), ttf);
  console.log(`Generated ${target}`);
}
