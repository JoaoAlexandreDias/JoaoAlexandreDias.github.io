const fs = require('fs');
const path = require('path');

// Directory to scan
const directoryPath = path.join(__dirname, 'Projects');

// Default config content
const defaultConfig = {
    title: "New Project",
    front_image: "",
    sections: [
        {
            id: "section1",
            class: "class1",
            content_file: "content1.html",
            pictures: [],
            picture_class: ""
        },
        {
            id: "section2",
            class: "class2",
            content_file: "content2.html",
            pictures: [],
            picture_class: ""
        },
        {
            id: "section3",
            class: "class3",
            content_file: "content3.html",
            pictures: [],
            picture_class: ""

        }
    ]
};

// Function to create config.json in a new folder
function createConfigFile(folderPath) {
    const configPath = path.join(folderPath, 'config.json');
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4), 'utf8');
        console.log(`config.json created in ${folderPath}`);
    }
}

// Scan the Projects directory and create config.json in new subfolders
fs.readdir(directoryPath, (err, items) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    // Filter out files, only include directories
    const folders = items.filter(item => fs.lstatSync(path.join(directoryPath, item)).isDirectory());

    // Create config.json in each folder if it doesn't exist
    folders.forEach(folder => {
        const folderPath = path.join(directoryPath, folder);
        createConfigFile(folderPath);
    });
});

console.log(`Scanned ${directoryPath} for new subfolders and created config.json where necessary.`);