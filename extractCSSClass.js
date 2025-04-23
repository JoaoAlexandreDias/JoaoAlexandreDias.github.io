const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Paths to the CSS file and database
const cssFilePath = path.join(__dirname, 'CSS', 'main_css.css');
const dbFilePath = path.join(__dirname, 'projects.db');

// Open the database
const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Function to extract class names from the CSS file
function extractClassNames(cssFilePath) {
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    const classRegex = /\.([a-zA-Z0-9_-]*content_frame_[a-zA-Z0-9_-]*)\s*{/g; // Regex to match class selectors with "content_frame_"
    const classNames = new Set();
    let match;

    while ((match = classRegex.exec(cssContent)) !== null) {
        classNames.add(match[1]); // Add the class name to the set
    }

    return Array.from(classNames); // Convert the set to an array
}

// Function to create the table and insert class names
function createTableAndInsertClasses(classNames) {
    // Create the table
    db.run(`
        CREATE TABLE IF NOT EXISTS css_classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_name TEXT NOT NULL UNIQUE
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table "css_classes" created successfully.');

            // Insert class names into the table after the table is created
            const insertStmt = db.prepare('INSERT OR IGNORE INTO css_classes (class_name) VALUES (?)');
            classNames.forEach((className) => {
                insertStmt.run(className, (err) => {
                    if (err) {
                        console.error(`Error inserting class "${className}":`, err.message);
                    }
                });
            });
            insertStmt.finalize(() => {
                console.log('Class names inserted successfully.');
            });
        }
    });
}

// Extract class names and populate the database
const classNames = extractClassNames(cssFilePath);
console.log('Extracted class names:', classNames);

createTableAndInsertClasses(classNames);

// Close the database after a delay to ensure all operations are complete
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Closed the database connection.');
        }
    });
}, 1000);