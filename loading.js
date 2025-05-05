
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

function addMouseoverProjectTitle() {
    document.querySelectorAll('main article').forEach(article => {
        const title = article.querySelector('img')?.alt;
        if (title) {
            const titleOverlay = document.createElement('div');
            titleOverlay.classList.add('title-overlay');
            const titleElement = document.createElement('h6');
            titleElement.style.margin = '30px';
            titleElement.innerHTML = title.replace(/ - /g, '<br>');
            titleOverlay.appendChild(titleElement);
            titleOverlay.style.position = 'absolute';
            titleOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            titleOverlay.style.color = 'white';
            titleOverlay.style.display = 'none';
            titleOverlay.style.pointerEvents = 'none';
            titleOverlay.style.width = '100%';
            titleOverlay.style.height = '100%'; // Match the article's height
            titleOverlay.style.textAlign = 'center';
            titleOverlay.style.top = '0'; // Cover the entire article
            titleOverlay.style.left = '0';
            titleOverlay.style.opacity = '0'; // Start fully transparent
            titleOverlay.style.transition = 'opacity 0.3s ease'; // Smooth fade-in/out
            titleOverlay.style.alignItems = 'center';
            titleOverlay.style.justifyContent = 'center';
            titleOverlay.style.fontSize = '1.5em';
            titleOverlay.style.lineHeight = '1.2em'; // Adjust line height for better spacing
            titleOverlay.style.overflowWrap = 'break-word'; // Ensure text wraps within the container
            article.style.position = 'relative';
            article.appendChild(titleOverlay);

            article.addEventListener('mouseenter', () => {
                titleOverlay.style.display = 'flex';
                titleOverlay.style.opacity = '1'; // Fade in
            });

            article.addEventListener('mouseleave', () => {
                titleOverlay.style.opacity = '0'; // Fade out
                setTimeout(() => {
                    titleOverlay.style.display = 'none';
                }, 300); // Wait for the fade-out to complete before hiding
            });
        }
    });
}

function updateImageGridLayout(imageGrid) {
    const articles = Array.from(imageGrid.children);
    const childCount = articles.length;

    let horizontalCount = 0;
    let verticalCount = 0;

    articles.forEach(article => {
        const images = Array.from(article.getElementsByTagName('img'));

        images.forEach(img => {
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            if (imgWidth > imgHeight) {
                horizontalCount++;
            } else {
                verticalCount++;
            }
        });
    });

    let columns;
    if (window.innerWidth <= 768) {
        if (horizontalCount > verticalCount) {
            columns = 1;
        } else {
            columns = 2;
        }
    } else if (horizontalCount > verticalCount) {
        columns = childCount < 3 ? childCount : 3;
    } else {
        columns = childCount < 6 ? childCount : 6;
    }

    imageGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    imageGrid.style.gridAutoRows = `${(window.innerHeight * 0.9) / (horizontalCount > verticalCount ? 3 : 2)}px`;
}

function reorderProjectsOnResize() {
    const container = document.querySelector('main'); // The container holding the projects
    const articles = Array.from(container.querySelectorAll('article')); // All project articles
    const navbar = document.getElementById("navbar-content");
    const h1 = navbar.querySelector("h1");
    const h3 = navbar.querySelector("h3");

    // Add a resize event listener
    window.addEventListener('resize', () => {

        // Check if the screen width is larger than 768px
        if (window.innerWidth <= 768) {
            h1.textContent = "JAD";
            h3.style.display = "none";
             // Do not reorder on smaller screens

             document.querySelectorAll('.image-grid article').forEach(article => {
                if (article.classList.contains('wide')) {
                    article.removeAttribute("style");
                    const currentSpan = parseInt(getComputedStyle(article).gridRow.replace('span ', ''), 10);
                    if (currentSpan > 1) {
                        article.style.gridRow = `span ${currentSpan - 1}`; // Adjust the row span if greater than 1
                    }
                }else if (article.classList.contains('tall')) {
                    article.style.gridColumn = ``;
                   // const currentSpan = parseInt(getComputedStyle(article).gridColumn.replace('span ', ''), 10);
                   // article.style.gridColumn = `span ${currentSpan + 1}`;
                }
            });
        }else{
            h1.textContent = "JOÃO ALEXANDRE DIAS";
            h3.style.display = "block";

            document.querySelectorAll('.image-grid article').forEach(article => {
                if (article.classList.contains('tall')) {
                    article.removeAttribute("style");
                    const currentSpan = parseInt(getComputedStyle(article).gridRow.replace('span ', ''), 10);
                    if (currentSpan > 1) {
                        article.style.gridRow = `span ${currentSpan +1}`; // Adjust the Column span if greater than 1
                    }
                }else if (article.classList.contains('wide')) {
                    article.removeAttribute("style");
                    const currentSpan = parseInt(getComputedStyle(article).gridColumn.replace('span ', ''), 10);
                    if (currentSpan > 1) {
                        article.style.gridColumn = `span ${currentSpan + 1}`; // Adjust the row span if greater than 1
                    }
                }
            });
        }
        // Capture the current state of the articles
        
        const state = Flip.getState(articles);

            // Example: Sort by data-date in descending order for larger screens
            articles.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
    

        // Append the articles back to the container in the new order
        articles.forEach(article => container.appendChild(article));

        // Animate the transition to the new state
        Flip.from(state, {
            duration: 0.2, // Animation duration
            ease: 'power1.inOut', // Easing function
            //stagger: 0.05, // Stagger effect for each article
        });
    });
}


function setupRootPage() {
    const grid = document.getElementById("main_content");

    // Add active state to nav
    document.getElementById("nav_projects").classList.add("active");

    // Ensure grid class is applied
    grid.classList.add("image-grid");

    // Sort articles by date
    const articles = Array.from(document.querySelectorAll('main article[data-date]'));
    articles.sort((a, b) => new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date')));
    const container = document.querySelector('main');
    articles.forEach(article => container.appendChild(article));
    const navbar = document.getElementById("navbar-content");
    const h1 = navbar.querySelector("h1");
    const h3 = navbar.querySelector("h3");


    // Apply title overlays on hover
    addMouseoverProjectTitle();

    if (window.innerWidth <= 768) {
        h1.textContent = "JAD";
        h3.style.display = "none";
         // Do not reorder on smaller screens

         document.querySelectorAll('.image-grid article').forEach(article => {
            if (article.classList.contains('wide')) {
                const currentSpan = parseInt(getComputedStyle(article).gridRow.replace('span ', ''), 10);
                article.style.gridRow = `span ${currentSpan - 1}`;
            }else if (article.classList.contains('tall')) {
               // const currentSpan = parseInt(getComputedStyle(article).gridColumn.replace('span ', ''), 10);
               // article.style.gridColumn = `span ${currentSpan + 1}`;
            }
        });
    }else{
        document.querySelectorAll('.image-grid article').forEach(article => {
            if (article.classList.contains('tall')) {
                const currentSpan = parseInt(getComputedStyle(article).gridRow.replace('span ', ''), 10);
                article.style.gridRow = `span ${currentSpan + 1}`;
            }else if (article.classList.contains('wide')) {
                const currentSpan = parseInt(getComputedStyle(article).gridColumn.replace('span ', ''), 10);
                article.style.gridColumn = `span ${currentSpan + 1}`;
            }
        });
    }
    

    // Animate navbar shrinking on scroll
    window.addEventListener("scroll", () => {
        
    
    if (window.innerWidth <= 768) {}else{
        if (window.scrollY > 0) {
            h1.style.fontSize = "1.2em";
            h3.style.fontSize = "0.7em";
            navbar.style.padding = '30px 20px';
        } else {
            h1.removeAttribute("style");
            h3.removeAttribute("style");
            navbar.removeAttribute("style");
        }
    }});


    // Register Flip plugin
    gsap.registerPlugin(
        Flip, ScrollTrigger, Observer, ScrollToPlugin, Draggable,
        MotionPathPlugin, EaselPlugin, PixiPlugin, TextPlugin,
        RoughEase, ExpoScaleEase, SlowMo, CustomEase
    );

    reorderProjectsOnResize();

}



window.onload = function(){
    const isRootPath = window.location.pathname === "/";
    const isAboutPath = window.location.pathname === "/about.html";
    const isProjectsPath = window.location.pathname.includes("/Projects/");
    const isBackEndPath = window.location.pathname.includes("/backend");

    if (isProjectsPath) {
        addImageClickEventListeners();
        document.getElementById("navbar-content").style.position = "relative";
        const imageGrid = document.querySelector('#Image_Grid');
        updateImageGridLayout(imageGrid);
        if (window.innerWidth <= 768) {
            const navbar = document.getElementById("navbar-content");
            const h1 = navbar.querySelector("h1");
            const h3 = navbar.querySelector("h3");
            h1.textContent = "JAD";
            h3.style.display = "none";
        }
    }
    if (isRootPath) {
        setupRootPage();

    }else if (isAboutPath) {
        document.getElementById("nav_about").classList.add("active");
        document.getElementById("navbar-content").style.position = "relative";
        document.getElementById("main_content").style.justifyContent = "space-between";


        if (window.innerWidth <= 768) {
            const navbar = document.getElementById("navbar-content");
            const h1 = navbar.querySelector("h1");
            const h3 = navbar.querySelector("h3");
            h1.textContent = "JAD";
            h3.style.display = "none";
        }else{
            document.getElementById("footer_content").style.position = "fixed";
            document.getElementById("footer_content").style.bottom = "0";
        }
        

    }else if (isBackEndPath) {
        document.getElementById("navbar-content").style.position = "relative";
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

    }
};


    
  

