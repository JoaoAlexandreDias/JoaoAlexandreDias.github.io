function setup() {
    // Defenição de que não será usado um canvas
    noCanvas();
    // Seleciona o elemento com o id 'email'
    var email = select("#email");
    // Seleciona o paragrafo com o id 'email_p'
    var email_parent = select("#email_p");

    
    // Cria um novo elemento de input
    const email_input = createInput();
    // Define o valor do input como o texto do elemento email
    email_input.value(email.elt.innerText);
    // Esconde o input
    email_input.hide();

    // Cria um botão para copiar o email
    const email_button = createButton('Copy Email');
    // Define o estilo do botão
    email_button.style('margin-left', '5px');
    email_button.style('padding', '0.2em 10px');
    email_button.style('backgroundColor', 'rgb(54 54 85)');
    email_button.style('color', 'white');
    email_button.style('border', 'none');
    email_button.style('borderRadius', '5px');
    email_button.style('cursor', 'pointer');
    email_button.style('fontSize', '0.8em');
    email_button.style('fontWeight', 'bold');
    email_button.style('textAlign', 'center');
    email_button.style('display', 'inline-block');
    email_button.style('textDecoration', 'none');
    email_button.style('width', 'fit-content');
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
                email_button.html('Copied!');
            })
            .catch(err => {
                console.error("Failed to copy email: ", err);
            });
        console.log(email_input.elt.value);
        // email_input.hide();
    });
    // Adiciona eventos de mouseOver e mouseOut ao elemento email
    email.mouseOver(function() {
        email_button.style('display', 'inline-block');
    });
    email.mouseOut(function() {
        // Hide the button after 5 seconds to give the user time to click it
        setTimeout(() => {
            email_button.hide();
            email_button.html('Copy Email');
        }, 2000);
    });
}
function draw() {

}
function windowResized() {
    
}
