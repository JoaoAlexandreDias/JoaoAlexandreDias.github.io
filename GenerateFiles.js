const fs = require('fs');
const path = require('path');

// Directory to scan
const directoryPath = path.join(__dirname, 'Projects');

// HTML file to create
const outputPathMain = path.join(__dirname, 'main_projects.html');
const outputPathAll = path.join(__dirname, 'projects.html');

// Default image path
const defaultImagePath = 'CSS/images/default_image.jpg';

// Function to generate HTML content
function generateHTML(folders) {
    let mainHtmlContent = '';
    let allHtmlContent = '';

    // Read and parse config files, then sort folders by date
    const folderConfigs = folders.map(folder => {
        const folderPath = path.join(directoryPath, folder);
        const configPath = path.join(folderPath, 'config.json');
        let config = {
            title: folder,
            date: "",
            category: "",
            front_image: ""
        };

        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        return { folder, config };
    });

    // Sort folders by date (newest first)
    folderConfigs.sort((a, b) => new Date(b.config.date) - new Date(a.config.date));

    // Generate HTML content for each folder
    folderConfigs.forEach(({ folder, config }, index) => {
        const folderPath = path.join(directoryPath, folder);
        let imagePath = defaultImagePath;
        const title = config.title || folder;
        const category = config.category || '';

        if (config.front_image) {
            const frontImagePath = path.join(folderPath, 'media', config.front_image);
            if (fs.existsSync(frontImagePath)) {
                imagePath = path.relative(__dirname, frontImagePath).replace(/\\/g, '/');
            }
        }

        const articleHtml = `<article data-category="${category}"><a href="#" data-target="Projects/${folder}/${folder}.html" data-title="${title} - Portfolio"><img class="article" src="${imagePath}" alt="${title}"></a></article>\n`;

        if (index < 3) {
            mainHtmlContent += articleHtml;
        } else {
            allHtmlContent += articleHtml;
        }
    });

    const mainHtml = `<h2>Recent Projects</h2><section>${mainHtmlContent}</section>`;
    const allHtml = `<div>${allHtmlContent}</div>`;

    return { mainHtml, allHtml };
}


// Function to generate HTML content for each folder
function generateFolderHTML(folderPath, folderName) {
    const configPath = path.join(folderPath, 'config.json');
    let config = {
        title: folderName,
        date: "",
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
            if (section.id === 'image-grid') {
                content = '<div id="image-grid">';
                section.pictures.forEach(picture => {
                    const imagePath = path.join(folderPath, 'media', picture);
                    const relativeImagePath = path.relative(__dirname, imagePath).replace(/\\/g, '/');
                    content += `<div><img src="${relativeImagePath}" class="${section.picture_class} image-clickable" alt="${section.id}"></div>`;
                });
                content += '</div>';
            } else {
                section.pictures.forEach(picture => {
                    const imagePath = path.join(folderPath, 'media', picture);
                    const relativeImagePath = path.relative(__dirname, imagePath).replace(/\\/g, '/');
                    content += `<img src="${relativeImagePath}" class="${section.picture_class} image-clickable" alt="${section.id}">`;
                });
            }
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

    // Generate HTML content for the main projects.html and all projects.html
    const { mainHtml, allHtml } = generateHTML(folders);

    // Write HTML content to the main projects.html file
    fs.writeFile(outputPathMain, mainHtml, (err) => {
        if (err) {
            return console.log('Unable to write HTML file: ' + err);
        }
        console.log('main_projects.html file has been generated successfully.');
    });

    // Write HTML content to the all projects.html file
    fs.writeFile(outputPathAll, allHtml, (err) => {
        if (err) {
            return console.log('Unable to write HTML file: ' + err);
        }
        console.log('projects.html file has been generated successfully.');
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