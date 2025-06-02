function setup() {
    // Define que não será usado o canvas
    noCanvas();
    // Seleciona todos os artigos
    var articles = selectAll('article');
    // Seleciona todas as imagens dentro dos artigos
    var articles_imgs = selectAll('article a img');

  console.log(articles);
        // Repete o código para cada artigo
        for (var i = 0; i < articles.length; i++) {
            // Define o artigo e a imagem correspondente
            var article = articles[i];
            var article_img = articles_imgs[i];
            // Define o titulo do artigo como o texto alternativo da imagem
            var title = article_img.elt.alt;

            if(title) {
                // Cria um elemento de div para o overlay do título
                const titleOverlay = createDiv();
                // Define a classe do overlay
                titleOverlay.class('title-overlay');
                // Cria um elemento de título
                const titleElement = createElement('h6');
                // Define o estilo do título
                titleElement.style('margin', '30px');
                // Define o texto do overlay como o título do artigo (Com quebra de linha)
                titleElement.html(title.replace(/ - /g, '<br>'));
               // console.log(titleElement);
                // Adiciona o elemento de título ao overlay
                titleOverlay.child(titleElement);
                // Define o estilo do overlay
                titleOverlay.style('position', 'absolute');
                titleOverlay.style('backgroundColor', 'rgba(0, 0, 0, 0.5)');
                titleOverlay.style('color', 'white');
                titleOverlay.style('display', 'none');
                titleOverlay.style('pointerEvents', 'none');
                titleOverlay.style('width', '100%');
                titleOverlay.style('height', '100%');
                titleOverlay.style('textAlign', 'center');
                titleOverlay.style('top', '0');
                titleOverlay.style('left', '0');
                titleOverlay.style('opacity', '0');
                titleOverlay.style('transition', 'opacity 0.3s ease');
                titleOverlay.style('alignItems', 'center');
                titleOverlay.style('justifyContent', 'center');
                titleOverlay.style('fontSize', '1.5em');
                titleOverlay.style('lineHeight', '1.2em');
                titleOverlay.style('overflowWrap', 'break-word');
                titleOverlay.style('zIndex', '1');
                article.style('position', 'relative');
                
                // Adiciona o overlay ao artigo
                titleOverlay.parent(article);

                // Adiciona eventos de mouseOver e mouseOut ao artigo
                article.mouseOver(function() {
                    titleOverlay.style('display', 'flex');
                    titleOverlay.style('opacity', '1');
                });
                article.mouseOut(function() {
                    titleOverlay.style('opacity', '0');
                    setTimeout(() => {
                        titleOverlay.style('display', 'none');
                    }, 300);
                });

            }
            
        }
  noLoop();
}
function draw() {

}
function windowResized() {
    
}
