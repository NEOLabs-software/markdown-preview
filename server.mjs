#!/usr/bin/env node
import fs from 'fs';
import express from 'express';
import markdownIt from 'markdown-it';

const app = express();
const md = new markdownIt();

const port = process.argv[3] || 3000; // Default port is 3000 if not specified
const markdownFilePath = process.argv[2];

if (!markdownFilePath) {
    console.error('Please specify a markdown file path as the first parameter.');
    process.exit(1);
}

fs.readFile(markdownFilePath, 'utf8', async (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err.message}`);
        process.exit(1);
    }

    const htmlContent = md.render(data);

    app.get('/', (req, res) => {
        res.send(htmlContent);
    });

    app.listen(port, async () => {
        console.log(`Server is running at http://localhost:${port}`);
        const open = await import('open');
        open.default(`http://localhost:${port}`);
    });
});
