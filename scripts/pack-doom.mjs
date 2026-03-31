import archiver from 'archiver';
import { createWriteStream } from 'fs';

const output = createWriteStream('./public/doom/doom.jsdos');
const archive = archiver('zip', { zlib: { level: 0 } });

archive.pipe(output);

await new Promise((resolve, reject) => {
  output.on('close', resolve);
  archive.on('error', reject);

  // Все файлы должны лежать внутри папки .jsdos/
  archive.file('./public/doom/DOOM.EXE', { name: '.jsdos/DOOM.EXE' });
  archive.file('./public/doom/DOOM1.WAD', { name: '.jsdos/DOOM1.WAD' });
  archive.file('./public/doom/doom.conf', { name: '.jsdos/dosbox.conf' });

  archive.finalize();
});

console.log('doom.jsdos created:', archive.pointer(), 'bytes');
