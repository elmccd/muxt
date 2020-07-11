import { promises as fs } from 'fs';
import { promisify } from 'util';
import path from 'path';
import glob from 'glob';

import {TwingEnvironment, TwingLoaderFilesystem} from 'twing';

let loader = new TwingLoaderFilesystem('./');
let twing = new TwingEnvironment(loader);

const processFile = async (file: string): Promise<void> => {
    console.log(`Processing: ${file}`);
    const render = await twing.render(file, {'name': 'World'});

    const targetFilePath = path.relative('pages', file);
    const targetFileName = path.basename(targetFilePath, '.twig') + '.html';
    const targetDir = 'dist/' + path.dirname(path.relative('pages', file));

    // ensure the target files tree exists
    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(`${targetDir}/${targetFileName}`, render)
    console.log(`Generated: ${file}`);
};

(async () => {
    const files = await promisify(glob)('pages/**/*.twig', {});
    files.forEach(processFile);
})();