import fs from 'fs-extra';
import { getManifest } from '../../src/manifest';
import { EXT_OUTDIR_WEBPACK, log, resRoot } from '../shared';

export async function writeManifest() {
  await fs.ensureDir(
    resRoot(`${EXT_OUTDIR_WEBPACK}/${process.env.TARGET_BROWSER}/`),
  );
  await fs.writeJSON(
    resRoot(
      `${EXT_OUTDIR_WEBPACK}/${process.env.TARGET_BROWSER}/manifest.json`,
    ),
    await getManifest(),
    {
      spaces: 2,
    },
  );
  log('PRE', 'write manifest.json');
}

writeManifest();
