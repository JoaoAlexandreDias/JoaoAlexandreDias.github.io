function setup() {
    // Defenição de que não será usado um canvas
    noCanvas();
    // Seleciona o elemento com o id 'email'
    var email = select("#email");
    // Seleciona o elemento pai do email
    var email_parent = email.parent();
    
    // Cria um novo elemento de input
    const email_input = createInput();
    // Define o valor do input como o texto do elemento email
    email_input.value(email.elt.innerText);
    // Esconde o input
    email_input.hide();

    // Cria um botão para copiar o email
    const email_button = createButton('Copy');
    // Define o estilo do botão
    email_button.style('left', '50%');
    email_button.style('margin-top', '5px');
    email_button.style('padding', '7px');
    email_button.style('backgroundColor', 'rgb(54 54 85)');
    email_button.style('color', 'white');
    email_button.style('border', 'none');
    email_button.style('borderRadius', '5px');
    email_button.style('cursor', 'pointer');
    email_button.style('fontSize', '16px');
    email_button.style('fontWeight', 'bold');
    email_button.style('textAlign', 'center');
    email_button.style('display', 'inline-block');
    email_button.style('textDecoration', 'none');
    email_button.style('zIndex', '1000');
    email_button.style('position', 'absolute');
    email_button.style('width', '70px');
    // Esconde o botão inicialmente
    email_button.hide();
    // Adiciona o botão ao elemento pai do email
    email_button.parent(email_parent);

    // Adiciona um evento de mousePressed ao botão
    email_button.mousePressed(function() {
        //email_input.show();
        navigator.clipboard.writeText(email_input.elt.value)
            .then(() => {
                console.log("Email copied to clipboard");
            })
            .catch(err => {
                console.error("Failed to copy email: ", err);
            });
        console.log(email_input.elt.value);
        // email_input.hide();
    });
    // Adiciona eventos de mouseOver e mouseOut ao elemento email
    email.mouseOver(function() {
        email_button.show();
    });
    email.mouseOut(function() {
        // Hide the button after 5 seconds to give the user time to click it
        setTimeout(() => {
            email_button.hide();
        }, 2000);
    });
}
function draw() {

}
function windowResized() {
    
}
