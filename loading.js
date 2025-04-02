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
    const images = Array.from(document.querySelectorAll('.image-clickable img')); // Get all clickable images

    images.forEach((img, index) => {
        img.addEventListener('click', () => {
            // Create the overlay element
            const overlay = document.createElement('div');
            overlay.classList.add('fullscreen-overlay');

            // Add the clicked image to the overlay
            const fullscreenImage = document.createElement('img');
            fullscreenImage.src = img.src;
            fullscreenImage.alt = img.alt;
            fullscreenImage.dataset.index = index; // Store the current image index
            overlay.appendChild(fullscreenImage);

            // Create navigation arrows
            const prevArrow = document.createElement('div');
            prevArrow.classList.add('nav-arrow', 'prev-arrow');
            prevArrow.innerHTML = '&#9664;'; // Left arrow (◀)
            overlay.appendChild(prevArrow);

            const nextArrow = document.createElement('div');
            nextArrow.classList.add('nav-arrow', 'next-arrow');
            nextArrow.innerHTML = '&#9654;'; // Right arrow (▶)
            overlay.appendChild(nextArrow);

            // Append the overlay to the body
            document.body.appendChild(overlay);

            // Add the "show" class for fade-in effect
            setTimeout(() => overlay.classList.add('show'), 10);

            // Close the overlay when clicked outside the image or on the overlay
            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    overlay.classList.remove('show');
                    setTimeout(() => overlay.remove(), 300); // Remove the overlay after the fade-out
                }
            });

            // Navigate to the previous image
            prevArrow.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent closing the overlay
                const currentIndex = parseInt(fullscreenImage.dataset.index, 10);
                const prevIndex = (currentIndex - 1 + images.length) % images.length; // Wrap around to the last image
                fullscreenImage.src = images[prevIndex].src;
                fullscreenImage.alt = images[prevIndex].alt;
                fullscreenImage.dataset.index = prevIndex;
            });

            // Navigate to the next image
            nextArrow.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent closing the overlay
                const currentIndex = parseInt(fullscreenImage.dataset.index, 10);
                const nextIndex = (currentIndex + 1) % images.length; // Wrap around to the first image
                fullscreenImage.src = images[nextIndex].src;
                fullscreenImage.alt = images[nextIndex].alt;
                fullscreenImage.dataset.index = nextIndex;
            });
        });
    });

    // Add keyboard navigation for left and right arrow keys
    document.addEventListener('keydown', (event) => {
        if (document.querySelector('.fullscreen-overlay')) {
            const fullscreenImage = document.querySelector('.fullscreen-overlay img');
            const currentIndex = parseInt(fullscreenImage.dataset.index, 10);

            if (event.key === 'ArrowLeft') {
                // Navigate to the previous image
                const prevIndex = (currentIndex - 1 + images.length) % images.length;
                fullscreenImage.src = images[prevIndex].src;
                fullscreenImage.alt = images[prevIndex].alt;
                fullscreenImage.dataset.index = prevIndex;
            } else if (event.key === 'ArrowRight') {
                // Navigate to the next image
                const nextIndex = (currentIndex + 1) % images.length;
                fullscreenImage.src = images[nextIndex].src;
                fullscreenImage.alt = images[nextIndex].alt;
                fullscreenImage.dataset.index = nextIndex;
            }else if(event.key === 'Escape') {
                // Close the overlay
                const overlay = document.querySelector('.fullscreen-overlay');
                if (overlay) {
                    overlay.classList.remove('show');
                    setTimeout(() => overlay.remove(), 300); // Remove the overlay after the fade-out
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const isRootPath = window.location.pathname === "/";
    const isAboutPath = window.location.pathname === "/about.html";
    const isProjectsPath = window.location.pathname.includes("/Projects/");
    const isBackEndPath = window.location.pathname.includes("/Backend");
    if (isProjectsPath) {
        addImageClickEventListeners();
        document.getElementById("navbar-content").style.position = "relative";
        const imageGrid = document.querySelector('#Image_Grid');
        if (imageGrid) {
            const childCount = imageGrid.children.length;

            if (childCount < 6) {
                imageGrid.style.gridTemplateColumns = `repeat(${childCount}, 1fr)`;
            } else {
                imageGrid.style.gridTemplateColumns = 'repeat(6, 1fr)';
            }
                imageGrid.style.gridAutoRows = `${(window.innerHeight * 0.9) / 2}px`;
        }
    }
    if (isRootPath) {
        document.getElementById("nav_projects").classList.add("active");
        document.getElementById("main_content").classList.add("image-grid");
        // Sort articles by data-date attribute
        const dates = Array.from(document.querySelectorAll('main article[data-date]'));
        dates.sort((a, b) => new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date')));

        // Append sorted articles back to the container
        const container = document.querySelector('main');
        dates.forEach(article => container.appendChild(article));

        // Add mouseover event to display project title near the mouse pointer
        document.querySelectorAll('main article').forEach(article => {
            const title = article.querySelector('img')?.alt;
            if (title) {
            const titleOverlay = document.createElement('div');
            titleOverlay.classList.add('title-overlay');
            titleOverlay.textContent = title;
            titleOverlay.style.position = 'fixed';
            titleOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            titleOverlay.style.color = 'white';
            titleOverlay.style.padding = '5px 10px';
            titleOverlay.style.borderRadius = '5px';
            titleOverlay.style.display = 'none';
            titleOverlay.style.pointerEvents = 'none';
            titleOverlay.style.whiteSpace = 'nowrap'; // Prevent text wrapping
            titleOverlay.style.width = 'auto'; // Automatically adjust width to fit content
            titleOverlay.style.transform = 'translate(-50%, calc(-100% - 5px))'; // Center horizontally and position 5px above the mouse
            document.body.appendChild(titleOverlay);

            article.addEventListener('mousemove', (event) => {
                titleOverlay.style.left = `${event.clientX + 10}px`;
                titleOverlay.style.top = `${event.clientY + 10}px`;
                titleOverlay.style.display = 'block';
            });

            article.addEventListener('mouseleave', () => {
                titleOverlay.style.display = 'none';
            });
            }
        });
    }else if (isAboutPath) {
        document.getElementById("nav_about").classList.add("active");
        document.getElementById("navbar-content").style.position = "relative";
        document.getElementById("main_content").style.justifyContent = "space-between";
        document.getElementById("footer_content").style.position = "fixed";
        document.getElementById("footer_content").style.bottom = "0";

    }else if (isBackEndPath) {
        document.getElementById("navbar-content").style.position = "relative";
    }
    // Initialize Quill.js
    const quill = new Quill('#editor-container', {
        theme: 'snow', // Use the "snow" theme (or "bubble" for a minimal theme)
        placeholder: 'Write something amazing...',
        modules: {
            toolbar: [
                [{ header: [1, 2, false] }], // Header levels
                ['bold', 'italic', 'underline'], // Text formatting
                ['link', 'image'], // Links and images
                [{ list: 'ordered' }, { list: 'bullet' }], // Lists
                ['clean'] // Remove formatting
            ]
        }
    });

    // Initialize Quill for the initial text section
    quillInstances.set(sectionCount, quill);

    console.log(`Quill Instances:`, quillInstances);

});

