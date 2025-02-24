 document.addEventListener("DOMContentLoaded", function() {
            fetch("Templates/Navbar.html")
                .then(response => response.text())
                .then(data => {
                    document.getElementById("navbar-content").innerHTML = data;

                    // Add event listeners to navbar links
                    document.querySelectorAll('nav a[data-target]').forEach(link => {
                        link.addEventListener('click', function(event) {
                            event.preventDefault();
                            const target = this.getAttribute('data-target');
                            const title = this.getAttribute('data-title');
                            fetch(target)
                                .then(response => response.text())
                                .then(data => {
                                    document.getElementById("main-content").innerHTML = data;
                                    document.title = title;
                                    addProjectLinksEventListeners(); // Ensure project links are updated
                                });
                        });
                    });
                });

                // Automatically load the "projects.html" content
                fetch("projects.html")
                    .then(response => response.text())
                    .then(data => {
                        document.getElementById("main-content").innerHTML = data;
                        addProjectLinksEventListeners(); // Ensure project links are updated
                    });
                });

// Function to add event listeners to project links
function addProjectLinksEventListeners() {
    document.querySelectorAll('main a[data-target]').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.getAttribute('data-target');
            const title = this.getAttribute('data-title');
            fetch(target)
                .then(response => response.text())
                .then(data => {
                    document.getElementById("main-content").innerHTML = data;
                    document.title = title;
                    addProjectLinksEventListeners(); // Ensure project links are updated
                });
        });
    });
}