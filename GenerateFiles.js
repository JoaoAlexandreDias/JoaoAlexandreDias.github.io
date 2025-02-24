const fs = require('fs');
const path = require('path');

// Directory to scan
const directoryPath = path.join(__dirname, 'Projects');

// HTML file to create
const outputPath = path.join(__dirname, 'projects.html');

// Default image path
const defaultImagePath = 'CSS/images/default_image.jpg';

// Function to generate HTML content
function generateHTML(folders) {
    let htmlContent = '';

    folders.forEach(folder => {
        const folderPath = path.join(directoryPath, folder);
        const configPath = path.join(folderPath, 'config.json');

        let imagePath = defaultImagePath;
        let title = folder;
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            title = config.title || folder;
            if (config.front_image) {
                const frontImagePath = path.join(folderPath, config.front_image);
                if (fs.existsSync(frontImagePath)) {
                    imagePath = path.relative(__dirname, frontImagePath).replace(/\\/g, '/');
                }
            }
        }

        htmlContent += `<a href="#" data-target="Projects/${folder}/${folder}.html" data-title="${title} - Portfolio"><img class="article" src="${imagePath}" alt="${title}"></a>\n`;
    });

    return htmlContent;
}

// Function to generate HTML content for each folder
function generateFolderHTML(folderPath, folderName) {
    const configPath = path.join(folderPath, 'config.json');
    let config = {
        title: folderName,
        sections: []
    };

    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    let sections = config.sections.map(section => {
        let content = '';
        if (section.content_file) {
            const contentFilePath = path.join(folderPath, section.content_file);
            if (fs.existsSync(contentFilePath)) {
                content = fs.readFileSync(contentFilePath, 'utf8');
            }
        } else if (section.pictures && section.pictures.length > 0) {
            section.pictures.forEach(picture => {
                const imagePath = path.join(folderPath, picture);
                const relativeImagePath = path.relative(__dirname, imagePath).replace(/\\/g, '/');
                content += `<img src="${relativeImagePath}" class="${section.picture_class}" alt="${section.id}">`;
            });
        }
        return `<section id="${section.id}" class="${section.class}">${content}</section>`;
    }).join('\n');

    return `${sections}`;
}


// Read the directory and generate the HTML file
fs.readdir(directoryPath, (err, items) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    // Filter out files, only include directories
    const folders = items.filter(item => fs.lstatSync(path.join(directoryPath, item)).isDirectory());

    // Generate HTML content for the main projects.html
    const htmlContent = generateHTML(folders);

    // Write HTML content to the main projects.html file
    fs.writeFile(outputPath, htmlContent, (err) => {
        if (err) {
            return console.log('Unable to write HTML file: ' + err);
        }
        console.log('HTML file has been generated successfully.');
    });

    // Generate and write HTML content for each folder
    folders.forEach(folder => {
        const folderPath = path.join(directoryPath, folder);
        const folderHTMLContent = generateFolderHTML(folderPath, folder);
        const folderHTMLPath = path.join(folderPath, `${folder}.html`);

        fs.writeFile(folderHTMLPath, folderHTMLContent, (err) => {
            if (err) {
                return console.log(`Unable to write HTML file for folder ${folder}: ` + err);
            }
            console.log(`HTML file for folder ${folder} has been generated successfully.`);
        });
    });
});