const fs = require('fs').promises; // Use the promise-based version of fs
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// File paths
const basePath = path.join(__dirname, 'Templates', 'WebPageBase.html');
const navbarPath = path.join(__dirname, 'Templates', 'Navbar.html');
const directoryPath = path.join(__dirname, 'Projects');

// Connect to the SQLite database
const db = new sqlite3.Database('./projects.db', (err) => {
    if (err) {
        console.error(`Database connection error: ${err.message}`);
    } else {
        console.log('Connected to the projects database.');
    }
});

// Helper function to query the database and return a promise
function dbAll(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Helper function to check if a directory exists
async function directoryExists(directoryPath) {
    try {
        await fs.access(directoryPath); // Check if the directory is accessible
        return true;
    } catch {
        return false; // If access fails, the directory does not exist
    }
}

// Helper function to copy a file
async function copyFile(source, destination) {
    try {
        await fs.copyFile(source, destination);
        console.log(`File copied: ${source} -> ${destination}`);
    } catch (err) {
        console.error(`Error copying file from ${source} to ${destination}: ${err.message}`);
    }
}

// Helper function to parse JSON safely
function safeParseJSON(jsonString, defaultValue = []) {
    try {
        return JSON.parse(jsonString);
    } catch (err) {
        console.error(`Error parsing JSON: ${err.message}`);
        return defaultValue;
    }
}

// Helper function to calculate the relative path
function getRelativePath(folderPath, rootPath) {
    const folderDepth = path.relative(folderPath, rootPath).split(path.sep).length;
    return '../'.repeat(folderDepth);
}

async function generateProjectFiles() {
    try {
        const projects = await dbAll('SELECT * FROM Projects');

        for (const project of projects) {
            const projectFolderPath = path.join(directoryPath, project.folder_name);

            if (!(await directoryExists(projectFolderPath))) {
                await fs.mkdir(projectFolderPath, { recursive: true });
                console.log(`Folder created: ${projectFolderPath}`);
            }

            const mediaFolderPath = path.join(projectFolderPath, 'media');
            if (!(await directoryExists(mediaFolderPath))) {
                await fs.mkdir(mediaFolderPath, { recursive: true });
                console.log(`Media folder created: ${mediaFolderPath}`);
            }

            if (project.front_image) {
                const sourceImagePath = path.join(__dirname, 'backend', project.front_image);
                const destinationImagePath = path.join(mediaFolderPath, path.basename(project.front_image));
                try {
                    await fs.access(destinationImagePath); // Check if the file exists
                  //  console.log(`File already exists: ${destinationImagePath}, skipping...`);
                } catch {
                    await copyFile(sourceImagePath, destinationImagePath);
                    console.log(`File copied: ${sourceImagePath} -> ${destinationImagePath}`);
                }
            }

            let baseTemplate = await fs.readFile(basePath, 'utf8');
            let navbarTemplate = await fs.readFile(navbarPath, 'utf8');

            // Calculate the relative path for the links
            const linkPrefix = getRelativePath(projectFolderPath, __dirname);

            // Replace the placeholder in the navbar template
          //  console.log(`Link Prefix: ${linkPrefix}`);
            baseTemplate = baseTemplate.replace('<link rel="stylesheet" href="CSS/main_css.css">', `<link rel="stylesheet" href="${linkPrefix}CSS/main_css.css">`);
            baseTemplate = baseTemplate.replace('<link rel="icon" href="CSS/images/Website_icon_32.png" sizes="32x32" type="image/png">', `<link rel="icon" href="${linkPrefix}CSS/images/Website_icon_32.png" sizes="32x32" type="image/png">`);
            baseTemplate = baseTemplate.replace('<link rel="icon" href="CSS/images/Website_icon_64.png" sizes="64x64" type="image/png">', `<link rel="icon" href="${linkPrefix}CSS/images/Website_icon_64.png" sizes="64x64" type="image/png">`);
            baseTemplate = baseTemplate.replace('<script src="loading.js"></script>', `<script src="${linkPrefix}loading.js"></script>`);
            navbarTemplate = navbarTemplate.replace('<a id="nav_projects" href=""><h2>Projects</h2></a>', `<a id="nav_projects" href="${linkPrefix}"><h2>Projects</h2></a>`);
            navbarTemplate = navbarTemplate.replace('<a id="nav_about" href="about.html" data-title="About - Portfolio"><h2>About</h2></a>', `<a id="nav_about" href="${linkPrefix}about.html" data-title="About - Portfolio"><h2>About</h2></a>`);

            let finalContent = baseTemplate.replace('<!-- Navbar Placeholder -->', navbarTemplate);
            finalContent = finalContent.replace('<!-- Title -->', project.title);

            const sections = await dbAll('SELECT * FROM Sections WHERE project_id = ?', [project.id]);
            let sectionsContent = '';

            for (const section of sections) {
                if (section.content_file) {
                    if (/<\/?[a-z][\s\S]*>/i.test(section.content_file)) {
                        sectionsContent += `<section id="${section.section_id}" class="${section.class_name}">\n`;
                        sectionsContent += section.content_file + '\n';
                        sectionsContent += `</section>\n`;
                    } else if (section.content_file.includes('uploads/')) {
                        const sourceImagePath = path.join(__dirname, 'backend', section.content_file);
                        const destinationImagePath = path.join(mediaFolderPath, path.basename(section.content_file));
                        try {
                            await fs.access(destinationImagePath); // Check if the file exists
                         //   console.log(`File already exists: ${destinationImagePath}, skipping...`);
                        } catch {
                            await copyFile(sourceImagePath, destinationImagePath);
                            console.log(`File copied: ${sourceImagePath} -> ${destinationImagePath}`);
                        }

                        const contentFilePath = section.content_file.replace('uploads/', 'media/');
                        sectionsContent += `<section id="${section.section_id}" class="${section.class_name} image-clickable">\n`;
                        sectionsContent += `<img src="${contentFilePath}" alt="${section.picture_alt}">\n`;
                        sectionsContent += `</section>\n`;
                    }
                }else{
                    sectionsContent += `<h3>Process / Old Models</h3>\n`;
                    sectionsContent += `<section id="${section.section_id}" class="${section.class_name}">\n`;
                    const pictures = safeParseJSON(section.pictures, []);
                    if (section.pictures){
                      //  console.log(pictures);
                        
                        for (const picture of pictures) {
                            const sourceImagePath = path.join(__dirname, 'backend', picture);
                            const destinationImagePath = path.join(mediaFolderPath, path.basename(picture));
                            try {
                                await fs.access(destinationImagePath); // Check if the file exists
                           //     console.log(`File already exists: ${destinationImagePath}, skipping...`);
                            } catch {
                                await copyFile(sourceImagePath, destinationImagePath);
                                console.log(`File copied: ${sourceImagePath} -> ${destinationImagePath}`);
                            }

                            const picturePath = picture.replace('uploads/', 'media/');
                            sectionsContent += '<article class="image-clickable">\n';
                            sectionsContent += `<img src="${picturePath}" alt="${path.basename(picture)}">\n`;
                            sectionsContent += '</article>\n';
                            
                            
                    }

                    }
                    
                    sectionsContent += `</section>\n`;
                }
            }

            finalContent = finalContent.replace('<!-- Main Content -->', sectionsContent);

            const projectIndexPath = path.join(projectFolderPath, 'index.html');

            if (!(await directoryExists(projectIndexPath))) { 
                await fs.writeFile(projectIndexPath, finalContent, 'utf8');
                console.log(`index.html created at: ${projectIndexPath}`);
            }else{
               // console.log(`index.html already exists at: ${projectIndexPath}, skipping...`);
            }
        }
    } catch (err) {
        console.error(`Error generating project files: ${err.message}`);
    }
}

async function generateIndexFile() {
    try {
        const projects = await dbAll('SELECT * FROM Projects ORDER BY date DESC');
        const projectLinks = await Promise.all(
            projects.map(async (project) => {
                let imageTag = '';
                let article_class = '';
                if (project.front_image) {
                    const image_name = path.basename(project.front_image).replace("uploads/", "");
                    const imagePath = path.join(directoryPath, project.folder_name, 'media', image_name);
                  //  console.log(imagePath);
                    try {
                        await fs.access(imagePath);
                        imageTag = `<img src="./Projects/${project.folder_name}/media/${path.basename(project.front_image)}" alt="${project.title}">`;
                    } catch {
                        console.warn(`Front image not found for project: ${project.title}`);
                    }
                }
                if (project.importance.includes('High')) {
                    article_class = project.importance.replace('High', 'large');
                } else if (project.importance.includes('Medium')) {
                    article_class = project.importance.replace('Medium', 'medium');
                } else {
                    article_class = project.importance.replace('Low', 'small')
                }
                return `<article class='${article_class}' data-date='${project.date}' data-category='${project.category}' ><a href="./Projects/${project.folder_name}/">${imageTag}</a></article>`;
            })
        );

        let baseTemplate = await fs.readFile(basePath, 'utf8');
        let navbarTemplate = await fs.readFile(navbarPath, 'utf8');

        const finalContent = baseTemplate
            .replace('<!-- Navbar Placeholder -->', navbarTemplate)
            .replace('<!-- Title -->', 'Projects Index')
            .replace('<!-- Main Content -->', projectLinks.join('\n'));

        const indexPath = path.join(__dirname, 'index.html');
        await fs.writeFile(indexPath, finalContent, 'utf8');
        console.log(`index.html created at: ${indexPath}`);
    } catch (err) {
        console.error(`Error generating index.html: ${err.message}`);
    }
}

async function main() {
    try {
        console.log('Running script at:', new Date().toLocaleString());
        await generateProjectFiles();
        await generateIndexFile();
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}


// Run the script every minute
//setInterval(main, 60 * 1000 * 5); // 60 seconds
main(); // Run immediately on startup

/*
// Fetch CSS classes for the current project
db.all('SELECT * FROM CSS_Classes', [], (err, cssClasses) => {
    if (err) {
        console.error(`Error fetching CSS classes: ${err.message}`);
        return;
    }

    // Generate an array for CSS classes and their styles
    let cssClassesArray = [];
    cssClasses.forEach((cssClass) => {
        cssClassesArray.push({
            className: cssClass.class_name
        });
    });
});

// Function to create folders based on the Projects table
function createProjectFolders() {
    db.all('SELECT * FROM Projects', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }

        rows.forEach((row) => {
            const projectFolderPath = path.join(directoryPath, row.folder_name);

            if (!fs.existsSync(projectFolderPath)) {
                fs.mkdirSync(projectFolderPath, { recursive: true });
                console.log(`Folder created: ${projectFolderPath}`);
            } else {
    

generateIndexFile();            console.log(`Folder already exists: ${projectFolderPath}`);
            }

            // Read the base template
            fs.readFile(basePath, 'utf8', (err, baseTemplate) => {
                if (err) {
                    console.error(`Error reading base template: ${err.message}`);
                    return;
                }

                // Read the navbar template
                fs.readFile(navbarPath, 'utf8', (err, navbarTemplate) => {
                    if (err) {
                        console.error(`Error reading navbar template: ${err.message}`);
                        return;
                    }

                    // Replace the navbar placeholder with the navbar content
                    var finalContent = baseTemplate.replace('<!-- Navbar Placeholder -->', navbarTemplate);
                    finalContent = finalContent.replace('<!-- Title -->', row.title);

                    // Fetch sections for the current project
                    db.all('SELECT * FROM Sections WHERE project_id = ?', [row.id], (err, sections) => {
                        if (err) {
                            console.error(`Error fetching sections: ${err.message}`);
                            return;
                        }

                        // Generate HTML for sections
                        let sectionsContent = '';
                        sections.forEach((section) => {
                            sectionsContent += `<section id="${section.section_id}" class="${cssClassesArray[section.class_id].className}">
                                <h2>${section.title}</h2>
                                <p>${section.content}</p>
                            </section>`;
                        });

                        // Replace the sections placeholder with the sections content
                        finalContent = finalContent.replace('<!-- Main Content -->', sectionsContent);
                    });


                    // Write the final content to the index.html in the project folder
                    const projectIndexPath = path.join(projectFolderPath, 'index.html');
                    fs.writeFile(projectIndexPath, finalContent, 'utf8', (err) => {
                        if (err) {
                            console.error(`Error writing index.html: ${err.message}`);
                        } else {
                            console.log(`index.html created at: ${projectIndexPath}`);
                        }
                    });
                });
            });

        });
    });
}

*/