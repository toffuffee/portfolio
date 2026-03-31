import archiver from 'archiver';
import { createWriteStream, readdirSync } from 'fs';

const GAME_DIR = './public/games/teenagent';

console.log('Files in public/games/teenagent:', readdirSync(GAME_DIR));

const output = createWriteStream(`${GAME_DIR}/teenagent.jsdos`);
const archive = archiver('zip', { zlib: { level: 0 } });

archive.pipe(output);

await new Promise((resolve, reject) => {
  output.on('close', resolve);
  archive.on('error', reject);

  const files = readdirSync(GAME_DIR).filter((f) => f !== 'teenagent.jsdos');
  for (const file of files) {
    const name = file === 'teenagent.conf' ? 'dosbox.conf' : file;
    archive.file(`${GAME_DIR}/${file}`, { name: `.jsdos/${name}` });
  }

  archive.finalize();
});

console.log('teenagent.jsdos created:', archive.pointer(), 'bytes');
