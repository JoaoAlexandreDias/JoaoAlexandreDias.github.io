/*document.addEventListener("DOMContentLoaded", function() {
    fetch("Templates/Navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-content").innerHTML = data;

            // Add event listeners to navbar links
            document.querySelectorAll('nav a[data-target]').forEach(link => {
                link.addEventListener('click', handleNavLinkClick);
            });
        });

    // Automatically load the "projects.html" content
    loadContent("main_projects.html", "main_content");
    loadContent("projects.html", "all_projects", () => {
        initializePage("main_projects.html");
    });
});

function handleNavLinkClick(event) {
    event.preventDefault();
    const main_target = this.getAttribute('data-target') === "projects" ? "main_projects.html" : this.getAttribute('data-target');
    const sub_target = this.getAttribute('data-target') === "projects" ? "projects.html" : this.getAttribute('data-sub-target');
    const title = this.getAttribute('data-title');

    loadContent(main_target, "main_content", () => {
        document.title = title;
        initializePage(main_target);
    });

    if (sub_target) {
        loadContent(sub_target, "all_projects", () => {
            document.title = title;
            initializePage(sub_target);
        });
    } else {
        document.getElementById("all_projects").innerHTML = "";
    }
}

function loadContent(url, elementId, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback();
        });
}

function initializePage(main_target) {
    addProjectLinksEventListeners();
    addCategoryEventListeners();
    addImageClickEventListeners();
    if (main_target == "main_projects.html" || main_target == "projects.html") {
        document.getElementById("categories").removeAttribute("style");
        document.getElementById("main_content").removeAttribute("style");
        filterProjects("All");
    } else {
        document.getElementById("categories").style.display = "none";
        document.getElementById("main_content").style.flexDirection = "row";
    }
}

// Function to add event listeners to project links
function addProjectLinksEventListeners() {
    document.querySelectorAll('main article a[data-target], section article a[data-target]').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.getAttribute('data-target');
            const title = this.getAttribute('data-title');
            const sub_target = this.getAttribute('data-sub-target');

            loadContent(target, "main_content", () => {
                document.title = title;
                initializePage(target);
            });

            if (sub_target) {
                loadContent(sub_target, "all_projects", () => {
                    document.title = title;
                    initializePage();
                });
            } else {
                document.getElementById("all_projects").innerHTML = "";
            }
        });
    });
}

// Function to add event listeners to category links
function addCategoryEventListeners() {
    document.querySelectorAll('#categories a[data-category]').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const category = this.getAttribute('data-category');
            loadProjectsPage(category);
        });
    });
}

// Function to filter projects based on category
function filterProjects(category) {
    document.querySelectorAll('main article[data-category]').forEach(article => {
        article.style.display = (category === "All" || article.getAttribute('data-category') === category) ? "block" : "none";
    });
    document.querySelectorAll('section article[data-category]').forEach(article => {
        article.style.display = (category === "All" || article.getAttribute('data-category') === category) ? "block" : "none";
    });
}

// Function to load the projects page and filter by category
function loadProjectsPage(category) {
    loadContent("main_projects.html", "main_content", () => {
        initializePage("main_projects.html");
        filterProjects(category);
    });
}
*/

// Function to add event listeners to images for fullscreen mode
function addImageClickEventListeners() {
    document.querySelectorAll('.image-clickable').forEach(img => {
        img.addEventListener('click', function() {
            const overlay = document.createElement('div');
            overlay.classList.add('fullscreen-overlay');
            overlay.innerHTML = `<img src="${this.src}" alt="${this.alt}">`;
            document.body.appendChild(overlay);
            setTimeout(() => overlay.classList.add('show'), 10);

            overlay.addEventListener('click', function() {
                overlay.classList.remove('show');
                setTimeout(() => document.body.removeChild(overlay), 300);
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const isRootPath = window.location.pathname === "/";
    const isAboutPath = window.location.pathname === "/about.html";
    const isProjectsPath = window.location.pathname.includes("/Projects/");
    if (!isRootPath && !isAboutPath) {
        document.getElementById("main_content").style.flexDirection = "row";
    } else {
        document.getElementById("main_content").removeAttribute("style");
    }
    if (isProjectsPath) {
        addImageClickEventListeners();
    }
    if (isRootPath) {
        document.getElementById("nav_projects").classList.add("active");
        document.getElementById("nav_about").removeAttribute("class");
    }else if (isAboutPath) {
        document.getElementById("nav_about").classList.add("active");
        document.getElementById("nav_projects").removeAttribute("class");
    }
});
