import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

const zip = new AdmZip();
const __dirname = path.resolve();

try {
  const dist = path.join(__dirname, '/gxdatav/');
  if (fs.existsSync(dist)) {
    zip.addLocalFolder(dist);

    const zipName = path.join(__dirname, '/gxdatav/' + 'gxdatav' + '.zip');

    zip.writeZip(zipName, () => {});
  }
} catch (error) {}
