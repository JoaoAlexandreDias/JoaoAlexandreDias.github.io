 document.addEventListener("DOMContentLoaded", function() {
            fetch("Templates/Navbar.html")
                .then(response => response.text())
                .then(data => {
                    document.getElementById("navbar-content").innerHTML = data;

                    // Add event listeners to navbar links
                    document.querySelectorAll('nav a[data-target]').forEach(link => {
                        link.addEventListener('click', function(event) {
                            event.preventDefault();
                            var main_target = this.getAttribute('data-target');
                            var sub_target = this.getAttribute('data-sub-target');
                            const title = this.getAttribute('data-title');
                            if(main_target === "projectos") {
                                main_target = "main_projects.html";
                                sub_target = "projects.html";
                            }
                            fetch(main_target)
                                .then(response => response.text())
                                .then(data => {
                                    document.getElementById("main_content").innerHTML = data;
                                    document.title = title;
                                    addProjectLinksEventListeners(); // Ensure project links are updated
                                    if (main_target === "main_projects.html") {
                                        document.getElementById("categories").classList.remove("hide");
                                        
                                    } else {
                                        document.getElementById("categories").classList.add("hide");
                                    }
                                });
                            if(sub_target != null){
                            fetch(sub_target)
                                .then(response => response.text())
                                .then(data => {
                                    document.getElementById("all_projects").innerHTML = data;
                                    document.title = title;
                                    addProjectLinksEventListeners(); // Ensure project links are updated
                                    addCategoryEventListeners(); // Add event listeners to category links
                                    filterProjects("All"); // Show all projects by default
                                });
                            }else{
                                document.getElementById("all_projects").innerHTML = "";
                            }
                        });
                    });
                });

                // Automatically load the "projects.html" content
                fetch("main_projects.html")
                    .then(response => response.text())
                    .then(data => {
                        document.getElementById("main_content").innerHTML = data;
                        
                    });
                fetch("projects.html")
                    .then(response => response.text())
                    .then(data => {
                        document.getElementById("all_projects").innerHTML = data;
                        addProjectLinksEventListeners(); // Ensure project links are updated
                        addCategoryEventListeners(); // Add event listeners to category links
                        filterProjects("All"); // Show all projects by default
                    });
                });

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
        if (category === "All" || article.getAttribute('data-category') === category) {
            article.style.display = "block";
        } else {
            article.style.display = "none";
        }
    });
}


// Function to add event listeners to project links
function addProjectLinksEventListeners() {
    document.querySelectorAll('main article a[data-target]').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.getAttribute('data-target');
            const title = this.getAttribute('data-title');
            fetch(target)
                .then(response => response.text())
                .then(data => {
                    document.getElementById("main_content").innerHTML = data;
                    document.title = title;
//                    addProjectLinksEventListeners(); // Ensure project links are updated
  //                  addCategoryEventListeners(); // Ensure category links are updated
    //                addImageClickEventListeners(); // Add event listeners to images
                });
        });
    });
    document.querySelectorAll('section article a[data-target]').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.getAttribute('data-target');
            const title = this.getAttribute('data-title');
            fetch(target)
                .then(response => response.text())
                .then(data => {
                    document.getElementById("main_content").innerHTML = data;
                    document.title = title;
                    addProjectLinksEventListeners(); // Ensure project links are updated
                    addCategoryEventListeners(); // Ensure category links are updated
                    addImageClickEventListeners(); // Add event listeners to images
                });
        });
    });
}

// Function to load the projects page and filter by category
function loadProjectsPage(category) {
    fetch("main_projects.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("main_content").innerHTML = data;
            addProjectLinksEventListeners(); // Ensure project links are updated
            addCategoryEventListeners(); // Add event listeners to category links
            filterProjects(category); // Filter projects by the selected category
        });
}

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