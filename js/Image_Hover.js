function setup() {
    noCanvas();
    var articles = selectAll('article');
    var articles_imgs = selectAll('article a img');

  console.log(articles);
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            var article_img = articles_imgs[i];
            var title = article_img.elt.alt;

            if(title) {
                const titleOverlay = createDiv();
                titleOverlay.class('title-overlay');
                const titleElement = createElement('h6');
                titleElement.style('margin', '30px');
                titleElement.html(title.replace(/ - /g, '<br>'));
               // console.log(titleElement);
                titleOverlay.child(titleElement);
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
                
                titleOverlay.parent(article);

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
