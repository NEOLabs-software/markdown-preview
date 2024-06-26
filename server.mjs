#!/usr/bin/env node
import express from 'express';
import { marked } from 'marked'
import fs from 'fs'; // Import the 'fs' module for file system access
import open from 'open';

const app = express();
const port = process.env.PORT || 3000;

// Set Content-Security-Policy header to restrict script execution (security measure)
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "script-src 'self'");
  next();
});

app.get('/', (req, res) => {
  const filePath = process.argv[2]; // Get the file path from the second argument

  if (!filePath) {
    return res.status(400).send('Please provide a markdown file path as an argument.');
  }

  try {
    const markdownText = fs.readFileSync(filePath, 'utf8'); // Read file content

    // Render markdown using marked and sanitize if necessary
    const sanitizedHtml = marked(markdownText, { sanitize: true });

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MdP</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@4.0.0/github-markdown.css">
  <link rel="icon" href="https://private-user-images.githubusercontent.com/101670923/332799221-890ee95c-c2aa-444b-931c-51e905186244.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTk0Mzc1OTMsIm5iZiI6MTcxOTQzNzI5MywicGF0aCI6Ii8xMDE2NzA5MjMvMzMyNzk5MjIxLTg5MGVlOTVjLWMyYWEtNDQ0Yi05MzFjLTUxZTkwNTE4NjI0NC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwNjI2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDYyNlQyMTI4MTNaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT02N2ZkM2JkNmY4YTFkNjcxYmZmM2M3YjU0NGUzOWU0OThjMWNjZjcyMzdlY2NiYjAyYjM2YWU5NzQ1Yzc3YjllJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.XQG1aBLxpYMtQ1FXbRqAlQKupO9I2b9KMyi9NQNAT0I">
</head>
<body>
  <div class="markdown-body">
    ${sanitizedHtml}
  </div>
  <script>
    // Close the window when the Node.js process exits (optional)
    process.on('exit', () => {
      window.close();
    });
  </script>
</body>
</html>
       `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error reading the markdown file.');
  }
});

process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here
  process.exit(0);
});

    app.listen(port, async () => {
        console.log(`Server is running at http://localhost:${port}`);
        const open = await import('open');
        open.default(`http://localhost:${port}`);
    });

