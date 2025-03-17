const fs = require('fs');
const path = require('path');

// File paths
const basePath = path.join(__dirname, 'Templates', 'WebPageBase.html');
const navbarPath = path.join(__dirname, 'Templates', 'Navbar.html');
const aboutContPath = path.join(__dirname, 'Templates', 'about_content.html');
const directoryPath = path.join(__dirname, 'Projects');
const indexPath = path.join(__dirname, 'index.html');
const aboutPath = path.join(__dirname, 'about.html');

// Default image path
const defaultImagePath = 'CSS/images/default_image.jpg';

// Function to read file content
function readFileContent(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

// Function to generate HTML content for projects
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

        const articleHtml = `<article data-category="${category}"><a href="Projects/${folder}" data-title="${title} - Portfolio"><img class="article" src="${imagePath}" alt="${title}"></a></article>\n`;

        if (index < 3) {
            mainHtmlContent += articleHtml;
        } else {
            allHtmlContent += articleHtml;
        }
    });

    const mainHtml = `<section>${mainHtmlContent}</section>`;
    const allHtml = `<div>${allHtmlContent}</div>`;

    return { mainHtml, allHtml };
}

// Function to generate HTML content for each folder
function generateFolderHTML(folderPath, folderName) {
    const configPath = path.join(folderPath, 'config.json');
    let config = {
        title: "",
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
                    const imagePath = path.join('media', picture);
                    const relativeImagePath = path.relative(__dirname, imagePath).replace(/\\/g, '/');
                    content += `<div><img src="${relativeImagePath}" class="${section.picture_class} image-clickable" alt="${section.id}"></div>`;
                });
                content += '</div>';
            } else {
                section.pictures.forEach(picture => {
                    const imagePath = path.join('media', picture);
                    const relativeImagePath = path.relative(__dirname, imagePath).replace(/\\/g, '/');
                    content += `<img src="${relativeImagePath}" class="${section.picture_class} image-clickable" alt="${section.id}">`;
                });
            }
        }
        return `<section id="${section.id}" class="${section.class}">${content}</section>`;
    }).join('\n');

    return `${sections}`;
}

// Function to insert content into base HTML
function insertContentIntoBase(baseContent, navbarContent, mainContent, subContent, title, depth) {
    // Calculate relative path for CSS and JS files
    const relativePath = '../'.repeat(depth);

    // Insert CSS link
    baseContent = baseContent.replace('<link rel="stylesheet" href="CSS/main_css.css">', `<link rel="stylesheet" href="${relativePath}CSS/main_css.css">`);

    // Insert JS script
    baseContent = baseContent.replace('<script src="loading.js"></script>', `<script src="${relativePath}loading.js"></script>`);

    navbarContent = navbarContent.replace('<a id="nav_projects" href=""><h2>Projects</h2></a>', `<a id="nav_projects" href="${relativePath}"><h2>Projects</h2></a>`);

    navbarContent = navbarContent.replace('<a id="nav_about" href="about.html" data-title="About - Portfolio"><h2>About</h2></a>', `<a id="nav_about" href="${relativePath}about.html" data-title="About - Portfolio"><h2>About</h2></a>`);

    // Insert navbar content
    baseContent = baseContent.replace('<!-- Navbar Placeholder -->', navbarContent);

    // Insert main content
    baseContent = baseContent.replace('<!-- Main Content -->', mainContent);

    // Insert sub content
    baseContent = baseContent.replace('<!-- Sub Content -->', subContent);

    // Insert title
    baseContent = baseContent.replace('<!-- Title -->', title);

    return baseContent;
}

// Read the contents of WebPageBase.html and Navbar.html
const baseContent = readFileContent(basePath);
const navbarContent = readFileContent(navbarPath);
const aboutContent = readFileContent(aboutContPath);

// Read the directory and generate the HTML file
fs.readdir(directoryPath, (err, items) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    // Filter out files, only include directories
    const folders = items.filter(item => fs.lstatSync(path.join(directoryPath, item)).isDirectory());

    // Generate HTML content for the projects
    const { mainHtml, allHtml } = generateHTML(folders);

    // Insert the contents into the base HTML and write to index.html
    const indexContent = insertContentIntoBase(baseContent, navbarContent, mainHtml, allHtml, "Projects - Portfolio", 0);
    fs.writeFile(indexPath, indexContent, (err) => {
        if (err) {
            return console.log('Unable to write index.html file: ' + err);
        }
        console.log('index.html file has been generated successfully.');
    });

    // Insert the contents into the base HTML and write to about.html
    const aboutContentFinal = insertContentIntoBase(baseContent, navbarContent, aboutContent, "", "About - Portfolio", 1);
    fs.writeFile(aboutPath, aboutContentFinal, (err) => {
        if (err) {
            return console.log('Unable to write about.html file: ' + err);
        }
        console.log('about.html file has been generated successfully.');
    });


    // Generate and write HTML content for each folder
    folders.forEach(folder => {
        const folderPath = path.join(directoryPath, folder);
        const folderHTMLContent = generateFolderHTML(folderPath, folder);
        const folderHTMLPath = path.join(folderPath, `index.html`);
        const configPath = path.join(folderPath, 'config.json');
        let config = { title: "" };
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }

        // Insert the folder content into the base HTML
        const folderBaseContent = insertContentIntoBase(baseContent, navbarContent, folderHTMLContent, '', config.title, 2);
        fs.writeFile(folderHTMLPath, folderBaseContent, (err) => {
            if (err) {
                return console.log(`Unable to write HTML file for folder ${folder}: ` + err);
            }
            console.log(`HTML file for folder ${folder} has been generated successfully.`);
        });
    });
});