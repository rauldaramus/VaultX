import fs from 'fs';
import path from 'path';

// Leer package.json para obtener la versión
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const packageVersion = packageJson.version;

const year = new Date().getFullYear();

function generateHeader(filename) {
  return `/**
 * @file: ${filename}
 * @version: ${packageVersion}
 * @author: Raul Daramus
 * @date: ${year}
 * Copyright (C) ${year} VaultX by Raul Daramus
 *
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 *
 * You are free to:
 *   - Share — copy and redistribute the material in any medium or format
 *   - Adapt — remix, transform, and build upon the material
 *
 * Under the following terms:
 *   - Attribution — You must give appropriate credit, provide a link to the license,
 *     and indicate if changes were made.
 *   - NonCommercial — You may not use the material for commercial purposes.
 *   - ShareAlike — If you remix, transform, or build upon the material, you must
 *     distribute your contributions under the same license as the original.
 */

`;
}

function agregarHeader(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      agregarHeader(filePath);
    } else if (/\.(js|ts|jsx|tsx)$/.test(file)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.startsWith('/**')) {
        // evita duplicados
        const header = generateHeader(file);
        fs.writeFileSync(filePath, header + content, 'utf8');
        console.log(`Cabecera agregada a: ${filePath}`);
      }
    }
  }
}

// Carpetas principales de Nx
['apps', 'libs'].forEach(folder => agregarHeader(`./${folder}`));
