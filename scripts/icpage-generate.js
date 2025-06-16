'use strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const imagesDir = path.join(__dirname, '../src/images/icons');
console.log(imagesDir);

fs.readdir(imagesDir, (err, files) => {
    if (err) {
        console.error(err);
    }
    const imageFiles = files.filter(file => /\.(svg)$/i.test(file));

    const imagesHtml = imageFiles.map(file => {
        const srcPath = `${file}`;
        return `
    <div style="padding: 10px; outline: 1px solid silver" title="${file}">
        <img src="${srcPath}" style="max-width:200px; margin:10px;">
    </div>
    `;
    }).join('\n');

    const html = `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8" />
                <title>Icons</title>
                <style>
                input[type='checkbox']:checked + div {
                    background: #000;
                }
                </style>
            </head>
            <body>
                <h1>Icons</h1>
                <label for="invert">Invert</label>
                <input type="checkbox" id="invert"/>
                <div style="display:flex; flex-wrap:wrap;">
                    ${imagesHtml}
                </div>
            </body>
            </html>
        `;

    fs.writeFile(`${imagesDir}/icons.html`, html, (err) => {});
})