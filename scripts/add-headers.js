const fs = require('fs');
const path = require('path');

// Leer package.json para obtener la versión
const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
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

function agregarHeader(target) {
  if (!fs.existsSync(target)) {
    console.warn(`Ruta no encontrada, se omite: ${target}`);
    return;
  }

  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    const ignoredDirs = new Set([
      'node_modules',
      '.next',
      '.git',
      '.turbo',
      'dist',
      'build',
    ]);

    if (ignoredDirs.has(path.basename(target))) {
      return;
    }

    const files = fs.readdirSync(target);
    for (const file of files) {
      agregarHeader(path.join(target, file));
    }
    return;
  }

  if (!/\.(js|ts|jsx|tsx)$/.test(path.basename(target))) {
    return;
  }

  const content = fs.readFileSync(target, 'utf8');
  if (!content.startsWith('/**')) {
    const header = generateHeader(path.basename(target));
    fs.writeFileSync(target, header + content, 'utf8');
    console.log(`Cabecera agregada a: ${target}`);
  }
}

const cliTargets = process.argv.slice(2).filter(target => target !== '--');
const targets = cliTargets.length ? cliTargets : ['apps', 'libs'];
targets.forEach(folder => agregarHeader(path.resolve(folder)));
