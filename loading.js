
// Function to add event listeners to images for fullscreen mode

//função que adiciona eventos de clique nas imagens para abrir em tela cheia e respetiva navegação (usado apenas nas páginas de projetos)
function addImageClickEventListeners() {
    // Seleciona todas as imagens clicáveis
    const images = Array.from(document.querySelectorAll('.image-clickable img')); // Get all clickable images
    // Por cada imagem, adiciona um evento de clique
    images.forEach((img, index) => {
        img.addEventListener('click', () => {

            // Cria o elemento de overlay 
            const overlay = document.createElement('div');
            overlay.classList.add('fullscreen-overlay');

            // Adiciona a imagem clicada ao overlay
            const fullscreenImage = document.createElement('img');
            fullscreenImage.src = img.src;
            fullscreenImage.alt = img.alt;
            fullscreenImage.dataset.index = index; // Store the current image index
            overlay.appendChild(fullscreenImage);

            // Cria as setas de navegação
            const prevArrow = document.createElement('div');
            prevArrow.classList.add('nav-arrow', 'prev-arrow');
            prevArrow.innerHTML = '&#9664;'; // Left arrow (◀)
            overlay.appendChild(prevArrow);

            const nextArrow = document.createElement('div');
            nextArrow.classList.add('nav-arrow', 'next-arrow');
            nextArrow.innerHTML = '&#9654;'; // Right arrow (▶)
            overlay.appendChild(nextArrow);

            // Adiciona o overlay ao body
            document.body.appendChild(overlay);

            // Adiciona a classe "show" para o efeito de fade-in
            setTimeout(() => overlay.classList.add('show'), 10);

            // Fecha o overlay ao clicar fora da imagem ou no overlay
            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    overlay.classList.remove('show');
                    setTimeout(() => overlay.remove(), 300); // Remove o overlay após o fade-out
                }
            });

            // Navega para a imagem anterior
            prevArrow.addEventListener('click', (event) => {
                event.stopPropagation(); // Impede o fechamento do overlay
                const currentIndex = parseInt(fullscreenImage.dataset.index, 10);
                const prevIndex = (currentIndex - 1 + images.length) % images.length; // Volta para a última imagem
                fullscreenImage.src = images[prevIndex].src;
                fullscreenImage.alt = images[prevIndex].alt;
                fullscreenImage.dataset.index = prevIndex;
            });

            // Navega para a próxima imagem
            nextArrow.addEventListener('click', (event) => {
                event.stopPropagation(); // Impede o fechamento do overlay
                const currentIndex = parseInt(fullscreenImage.dataset.index, 10);
                const nextIndex = (currentIndex + 1) % images.length; // Volta para a primeira imagem
                fullscreenImage.src = images[nextIndex].src;
                fullscreenImage.alt = images[nextIndex].alt;
                fullscreenImage.dataset.index = nextIndex;
            });
        });
    });

    // Adiciona navegação por teclado para as setas esquerda e direita
    document.addEventListener('keydown', (event) => {
        if (document.querySelector('.fullscreen-overlay')) {
            const fullscreenImage = document.querySelector('.fullscreen-overlay img');
            const currentIndex = parseInt(fullscreenImage.dataset.index, 10);

            if (event.key === 'ArrowLeft') {
                // Navega para a imagem anterior
                const prevIndex = (currentIndex - 1 + images.length) % images.length;
                fullscreenImage.src = images[prevIndex].src;
                fullscreenImage.alt = images[prevIndex].alt;
                fullscreenImage.dataset.index = prevIndex;
            } else if (event.key === 'ArrowRight') {
                // Navega para a próxima imagem
                const nextIndex = (currentIndex + 1) % images.length;
                fullscreenImage.src = images[nextIndex].src;
                fullscreenImage.alt = images[nextIndex].alt;
                fullscreenImage.dataset.index = nextIndex;
            } else if (event.key === 'Escape') {
                // Fecha o overlay
                const overlay = document.querySelector('.fullscreen-overlay');
                if (overlay) {
                    overlay.classList.remove('show');
                    setTimeout(() => overlay.remove(), 300); // Remove o overlay após o fade-out
                }
            }
        }
    });
}
// função substituida por Image_Hover.js
function addMouseoverProjectTitle() {
    /*
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
    */
}
// função que atualiza o layout da grade de imagens com base no número de imagens horizontais e verticais (usado apenas nas páginas de projetos)
function updateImageGridLayout(imageGrid) {
    // Seleciona todos os artigos dentro da grade de imagens
    const articles = Array.from(imageGrid.children);
    // Numero de artigos
    const childCount = articles.length;
    // Variaveis para contar imagens horizontais e verticais
    let horizontalCount = 0;
    let verticalCount = 0;
    // Itera sobre cada artigo e conta as imagens horizontais e verticais
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
    // Define o número de colunas com base na contagem de imagens horizontais e verticais
    // Se a largura da janela for menor ou igual a 768px, define o número de colunas como 1 ou 2
    if (window.innerWidth <= 768) {
        if (horizontalCount > verticalCount) {
            columns = 1;
        } else {
            columns = 2;
        }
    // Se a largura da janela for maior que 768px, define o número de colunas com base na contagem de imagens
    } else if (horizontalCount > verticalCount) {
        columns = childCount < 3 ? childCount : 3;
    } else {
        columns = childCount < 6 ? childCount : 6;
    }
    // Define o estilo da grade de imagens
    imageGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    // Define o estilo da grade de imagens para as linhas de acordo com a contagem de imagens horizontais e verticais
    imageGrid.style.gridAutoRows = `${(window.innerHeight * 0.9) / (horizontalCount > verticalCount ? 3 : 2)}px`;
}

// função que reordena os projetos com base na data e ajusta o layout da grade de imagens ao redimensionar a janela (usado apenas na página inicial)
function reorderProjectsOnResize() {
    const container = document.querySelector('main'); // Seleciona o container principal onde os artigos estão localizados
    const articles = Array.from(container.querySelectorAll('article')); // Seleciona todos os artigos
    const navbar = document.getElementById("navbar-content"); // Seleciona a barra de navegação
    const h1 = navbar.querySelector("h1"); // Seleciona o elemento h1 dentro da barra de navegação
    const h3 = navbar.querySelector("h3"); // Seleciona o elemento h3 dentro da barra de navegação

    // Adiciona um evento de redimensionamento
    window.addEventListener('resize', () => {

        // Verifica se a largura da janela é menor ou igual a 768px
        if (window.innerWidth <= 768) {
            h1.textContent = "JAD";
            h3.style.display = "none";

            // Não reordena os artigos em telas pequenas, apenas ajusta o layout

            // Remove estilos de grid para artigos com classe 'wide' e ajusta a altura
             document.querySelectorAll('.image-grid article').forEach(article => {
                if (article.classList.contains('wide')) {
                    article.removeAttribute("style");
                    const currentSpan = parseInt(getComputedStyle(article).gridRow.replace('span ', ''), 10);
                    if (currentSpan > 1) {
                        article.style.gridRow = `span ${currentSpan - 1}`; // Ajusta a altura se maior que 1
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
                        article.style.gridRow = `span ${currentSpan +1}`; // Ajusta a altura se maior que 1
                    }
                }else if (article.classList.contains('wide')) {
                    article.removeAttribute("style");
                    const currentSpan = parseInt(getComputedStyle(article).gridColumn.replace('span ', ''), 10);
                    if (currentSpan > 1) {
                        article.style.gridColumn = `span ${currentSpan + 1}`; // Ajusta a largura se maior que 1
                    }
                }
            });
        }
        // Inicio do codigo necessário para as animações

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

        // Fim do codigo necessário para as animações
    });
}

// função que configura a página inicial (usado apenas na página inicial)
function setupRootPage() {
    // Seleciona a grade de imagens
    const grid = document.getElementById("main_content");

    // Adiciona estado ativo à navegação
    document.getElementById("nav_projects").classList.add("active");

    // Garante que a classe da grade esteja aplicada
    grid.classList.add("image-grid");

    // Ordena os artigos por data
    const articles = Array.from(document.querySelectorAll('main article[data-date]'));
    articles.sort((a, b) => new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date')));
    const container = document.querySelector('main');
    articles.forEach(article => container.appendChild(article));

    // seleciona elementos da barra de navegação
    const navbar = document.getElementById("navbar-content");
    const h1 = navbar.querySelector("h1");
    const h3 = navbar.querySelector("h3");


    // Apply title overlays on hover
    //addMouseoverProjectTitle();

    // Ajustes de layout para telas pequenas
    if (window.innerWidth <= 768) {
        h1.textContent = "JAD";
        h3.style.display = "none";
         // Não reordena os artigos em telas pequenas

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
    

    // Animação de scroll para a barra de navegação
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

    // Código necessário para as animações
    // Register Flip plugin
    gsap.registerPlugin(
        Flip, ScrollTrigger, Observer, ScrollToPlugin, Draggable,
        MotionPathPlugin, EaselPlugin, PixiPlugin, TextPlugin,
        RoughEase, ExpoScaleEase, SlowMo, CustomEase
    );

    reorderProjectsOnResize();
    // Fim do código necessário para as animações
}


// função que verifica a página atual e executa a configuração adequada
window.onload = function(){
    const isRootPath = window.location.pathname === "/"; // Verifica se a página atual é a página inicial
    const isAboutPath = window.location.pathname === "/about.html"; // Verifica se a página atual é a página "about"
    const isProjectsPath = window.location.pathname.includes("/Projects/"); // Verifica se a página atual é uma página de projetos
    const isBackEndPath = window.location.pathname.includes("/backend"); // Verifica se a página atual é uma página de backend

    // Configuração da página com base no caminho atual
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


    
  

